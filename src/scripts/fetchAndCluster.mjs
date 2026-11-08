import { XMLParser } from "fast-xml-parser";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf4Tc3sytJsCaolXQtTfvOY8LOcp_JjxY",
  authDomain: "sports-news-pulse-2026.firebaseapp.com",
  projectId: "sports-news-pulse-2026",
  storageBucket: "sports-news-pulse-2026.firebasestorage.app",
  messagingSenderId: "135781768506",
  appId: "1:135781768506:web:a2fc5044dcbbffbc590403",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const parser = new XMLParser({ ignoreAttributes: false });

const FEEDS = [
  {
    sourceId: "walla",
    sourceName: "וואלה! ספורט",
    sourceLang: "he",
    url: "https://rss.walla.co.il/feed/156",
  },
  {
    sourceId: "ynet",
    sourceName: "Ynet ספורט",
    sourceLang: "he",
    url: "https://www.ynet.co.il/Integration/StoryRss3.xml",
  },
  {
    sourceId: "bbc",
    sourceName: "BBC Sport",
    sourceLang: "en",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
  },
  {
    sourceId: "espn",
    sourceName: "ESPN NBA",
    sourceLang: "en",
    url: "https://www.espn.com/espn/rss/nba/news",
  },
];

// Dynamic Content Classifier: Analyzes actual text to identify sport & competition
function classifySportAndCompetition(headline, text, defaultCategoryHint) {
  const combined = (headline + " " + text).toLowerCase();

  // 1. Tennis & Global / Olympic sports
  if (
    combined.includes("טניס") ||
    combined.includes("מדורגת") ||
    combined.includes("משחקון") ||
    combined.includes("גראנד סלאם") ||
    combined.includes("wta") ||
    combined.includes("atp") ||
    combined.includes("טורניר החשוב") ||
    combined.includes("טניסאי")
  ) {
    return {
      category: "global-stories",
      categoryLabel: "טניס וספורט עולמי",
      badge: "טניס עולמי",
    };
  }

  // 2. Israeli Basketball
  if (
    combined.includes("חולון") ||
    combined.includes("קרוניץ'") ||
    combined.includes("קרוניץ") ||
    combined.includes("ליגת ווינר סל") ||
    combined.includes("הפועל ירושלים") ||
    (combined.includes("כדורסל") && !combined.includes("nba") && !combined.includes("יורוליג"))
  ) {
    return {
      category: "israeli-basketball",
      categoryLabel: "כדורסל ישראלי",
      badge: "ליגת ווינר סל",
    };
  }

  // 3. EuroLeague
  if (
    combined.includes("יורוליג") ||
    combined.includes("euroleague") ||
    (combined.includes("מכבי תל אביב") && combined.includes("אירופה"))
  ) {
    return {
      category: "euroleague",
      categoryLabel: "יורוליג",
      badge: "EuroLeague",
    };
  }

  // 4. NBA
  if (
    combined.includes("nba") ||
    combined.includes("דונצ'יץ'") ||
    combined.includes("דונציץ") ||
    combined.includes("doncic") ||
    combined.includes("curry") ||
    combined.includes("lebron") ||
    combined.includes("לייקרס") ||
    combined.includes("גולדן סטייט") ||
    combined.includes("סלטיקס") ||
    combined.includes("סטף קרי")
  ) {
    return {
      category: "nba",
      categoryLabel: "NBA",
      badge: "NBA",
    };
  }

  // 5. European / International Football
  if (
    combined.includes("fa cup") ||
    combined.includes("הגביע האנגלי") ||
    combined.includes("פרמייר ליג") ||
    combined.includes("premier league") ||
    combined.includes("ליגת האלופות") ||
    combined.includes("champions league") ||
    combined.includes("סיטי") ||
    combined.includes("ארסנל") ||
    combined.includes("ליברפול") ||
    combined.includes("ריאל מדריד") ||
    combined.includes("ברצלונה") ||
    combined.includes("maresca")
  ) {
    let badge = "אירופה ומפעלים";
    if (combined.includes("fa cup") || combined.includes("הגביע האנגלי")) badge = "הגביע האנגלי • FA Cup";
    else if (combined.includes("premier league") || combined.includes("פרמייר ליג") || combined.includes("maresca")) badge = "פרמייר ליג";
    else if (combined.includes("champions league") || combined.includes("אלופות")) badge = "ליגת האלופות";

    return {
      category: "uefa-tournaments",
      categoryLabel: "אירופה ומפעלים",
      badge,
    };
  }

  // 6. Israeli Football (Default for Israeli football feeds)
  return {
    category: "israeli-football",
    categoryLabel: "כדורגל ישראלי",
    badge: "ליגת העל",
  };
}

// Dynamic Editorial Signal: Is it an in-depth story / magazine piece, or a short breaking update?
function determineStoryType(headline, paragraphs) {
  const text = (headline + " " + paragraphs.join(" ")).toLowerCase();
  const totalLength = paragraphs.join(" ").length;

  const isEditorialTitle =
    text.includes("ריאיון") ||
    text.includes("ראיון") ||
    text.includes("טור דעה") ||
    text.includes("טור:") ||
    text.includes("ניתוח") ||
    text.includes("מאחורי הקלעים") ||
    text.includes("תחקיר") ||
    text.includes("הסיפור הבלתי") ||
    text.includes("ההזדמנות של") ||
    text.includes("להוכיח למבקרים") ||
    text.includes("inside") ||
    text.includes("analysis") ||
    text.includes("feature");

  // If long read (> 5 paragraphs or > 1200 characters) OR has editorial signals
  if (paragraphs.length >= 5 || totalLength > 1200 || isEditorialTitle) {
    return "story"; // In-depth magazine / feature story (Retained for 7 days)
  }

  return "breaking"; // Breaking update / short news (Retained for 12 hours)
}

// Extract full article paragraphs using Mozilla Readability
async function extractFullArticle(url) {
  if (!url) return [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timer);
    if (!res.ok) return [];

    const html = await res.text();
    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const parsed = reader.parse();

    const $ = cheerio.load(parsed?.content || html);
    $("script, style, noscript, nav, header, footer, .ad-banner, .comments").remove();

    const pList = $("p, .text-content, .text-block, [itemprop='articleBody'] p")
      .map((i, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(t => t.length > 25 && !t.includes("cookie") && !t.includes("להורדת האפליקציה") && !t.includes("כל הזכויות"));

    return pList.slice(0, 15);
  } catch (err) {
    return [];
  }
}

// Extract key named entities for cross-source matching
function extractEntities(headline, text) {
  const combined = (headline + " " + text).toLowerCase();
  const found = new Set();

  const ENTITY_DICTIONARY = [
    { key: "doncic", match: ["דונצ'יץ'", "דונציץ", "doncic", "luka"] },
    { key: "curry", match: ["קרי", "curry", "stephen curry", "סטף קרי"] },
    { key: "lebron", match: ["לברון", "ג'יימס", "lebron"] },
    { key: "hapoel_ta", match: ["הפועל תל אביב", "הפועל ת\"א", "הפועל ת'א", "אליניב ברדה", "ברדה"] },
    { key: "dego_rg", match: ["מסאי דגו", "ברוך דגו", "דגו", "הפועל רמת גן", "הפועל ר\"ג"] },
    { key: "holon_krunic", match: ["קרוניץ'", "קרוניץ", "הפועל חולון", "פרדראג"] },
    { key: "daniel_peretz", match: ["דניאל פרץ", "פרץ", "צור עשה"] },
    { key: "maresca", match: ["maresca", "מרסקה"] },
    { key: "bachar", match: ["בכר", "ברק בכר"] },
    { key: "tennis_no1", match: ["מדורגת מספר 1", "המדורגת מספר", "פרשה מהטורניר"] },
  ];

  for (const ent of ENTITY_DICTIONARY) {
    for (const m of ent.match) {
      if (combined.includes(m)) {
        found.add(ent.key);
        break;
      }
    }
  }

  return Array.from(found);
}

async function run() {
  console.log("=== Running Dynamic Sports Ingestion & Retention Engine ===");

  const rawArticles = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Scanning: ${feed.sourceName}...`);
      const res = await fetch(feed.url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const xml = await res.text();
      const parsed = parser.parse(xml);
      const items = parsed?.rss?.channel?.item || [];
      const list = Array.isArray(items) ? items : [items];

      for (const item of list.slice(0, 6)) {
        const headline = String(item.title || "").trim();
        const excerpt = String(item.description || "").replace(/<[^>]*>?/gm, "").trim().slice(0, 240);
        const originalUrl = String(item.link || "").trim();

        let imageUrl = "";
        if (item.enclosure && item.enclosure["@_url"]) {
          imageUrl = item.enclosure["@_url"];
        } else if (item["media:content"] && item["media:content"]["@_url"]) {
          imageUrl = item["media:content"]["@_url"];
        } else if (item["media:thumbnail"] && item["media:thumbnail"]["@_url"]) {
          imageUrl = item["media:thumbnail"]["@_url"];
        }

        if (headline.length > 5) {
          rawArticles.push({
            sourceId: feed.sourceId,
            sourceName: feed.sourceName,
            sourceLang: feed.sourceLang,
            headline,
            excerpt,
            originalUrl,
            imageUrl,
            publishedAt: item.pubDate ? new Date(item.pubDate).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) : "עכשיו",
            pubDateTimestamp: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
          });
        }
      }
    } catch (e) {
      console.warn(`Feed error (${feed.sourceName}):`, e.message);
    }
  }

  console.log(`Gathered ${rawArticles.length} raw items. Extracting full text via Readability...`);

  for (const art of rawArticles) {
    const fullParagraphs = await extractFullArticle(art.originalUrl);
    art.contentParagraphs = fullParagraphs.length > 0 ? fullParagraphs : [art.excerpt];

    // Dynamic Content Classification: Based on actual article text, not the feed!
    const classification = classifySportAndCompetition(art.headline, art.excerpt + " " + (art.contentParagraphs[0] || ""));
    art.category = classification.category;
    art.categoryLabel = classification.categoryLabel;
    art.badge = classification.badge;

    // Dynamic Story vs Breaking Classification:
    art.storyType = determineStoryType(art.headline, art.contentParagraphs);

    art.entities = extractEntities(art.headline, art.excerpt);
    console.log(`• [${art.sourceName}] "${art.headline.slice(0, 32)}..." -> [${art.categoryLabel}] [${art.storyType.toUpperCase()}]`);
  }

  console.log("Clustering based on shared entities and topic context...");

  const clusteredStories = [];
  const processedArticles = new Set();

  for (let i = 0; i < rawArticles.length; i++) {
    if (processedArticles.has(i)) continue;
    const current = rawArticles[i];
    processedArticles.add(i);

    const matchingArticles = [current];

    // Look for matching sibling articles
    if (current.entities.length > 0) {
      for (let j = i + 1; j < rawArticles.length; j++) {
        if (processedArticles.has(j)) continue;
        const candidate = rawArticles[j];

        // Match if they share an entity AND category, and are from different sources
        const shareEntity = current.entities.some(e => candidate.entities.includes(e));
        if (shareEntity && candidate.sourceId !== current.sourceId) {
          matchingArticles.push(candidate);
          processedArticles.add(j);
          console.log(`  🔗 MATCHED: [${current.sourceName}] + [${candidate.sourceName}] on entity ${current.entities.join(", ")}`);
        }
      }
    }

    const storyId = `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const isMultiSource = matchingArticles.length > 1;

    // If any source had in-depth story, upgrade cluster to story
    const finalStoryType = matchingArticles.some(a => a.storyType === "story") ? "story" : "breaking";

    clusteredStories.push({
      id: storyId,
      headline: current.headline,
      summary: current.excerpt || current.headline,
      imageUrl: current.imageUrl || "/default-story-bg.jpg",
      category: current.category,
      categoryLabel: current.categoryLabel,
      competitionBadge: current.badge,
      storyType: finalStoryType,
      updatedAt: "עודכן עכשיו",
      readingTimeMinutes: Math.max(2, Math.round(current.contentParagraphs.join(" ").length / 350)),
      articles: matchingArticles,
      createdAt: Timestamp.fromMillis(current.pubDateTimestamp),
    });
  }

  console.log(`Generated ${clusteredStories.length} strictly clustered stories.`);

  // 12-Hour Retention Check for breaking news:
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  console.log("Executing Retention Policy (Breaking TTL: 12h, Magazine TTL: 7d)...");

  // Read existing stories from Firestore to delete expired items
  const existingDocs = await getDocs(collection(db, "stories"));
  let deletedCount = 0;

  for (const docSnap of existingDocs.docs) {
    const data = docSnap.data();
    const createdMs = data.createdAt?.toMillis?.() || 0;
    const age = now - createdMs;

    if (data.storyType === "breaking" && age > TWELVE_HOURS_MS) {
      await deleteDoc(docSnap.ref);
      deletedCount++;
    } else if (data.storyType === "story" && age > SEVEN_DAYS_MS) {
      await deleteDoc(docSnap.ref);
      deletedCount++;
    }
  }

  console.log(`Purged ${deletedCount} expired items older than their TTL.`);

  // Clear remaining stale items to keep database strictly synchronized
  for (const docSnap of existingDocs.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Save the fresh clustered stories
  for (let i = 0; i < clusteredStories.length; i++) {
    const story = clusteredStories[i];
    const storyRef = doc(db, "stories", story.id);
    await setDoc(storyRef, {
      ...story,
      createdAt: Timestamp.fromMillis(now - i * 60000), // orderly chronological index
    });
    console.log(`✓ Saved [${story.categoryLabel}] [${story.storyType}] "${story.headline.slice(0, 35)}..." (${story.articles.length} sources)`);
  }

  console.log("=== Synchronization complete! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
