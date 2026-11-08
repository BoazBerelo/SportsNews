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
    isInternational: false,
    url: "https://rss.walla.co.il/feed/156",
  },
  {
    sourceId: "ynet",
    sourceName: "Ynet ספורט",
    sourceLang: "he",
    isInternational: false,
    url: "https://www.ynet.co.il/Integration/StoryRss3.xml",
  },
  {
    sourceId: "bbc",
    sourceName: "BBC Sport",
    sourceLang: "en",
    isInternational: true,
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
  },
  {
    sourceId: "espn",
    sourceName: "ESPN NBA",
    sourceLang: "en",
    isInternational: true,
    url: "https://www.espn.com/espn/rss/nba/news",
  },
];

// Scrape Sport5 top articles directly
async function fetchSport5Articles() {
  try {
    console.log("Scraping Sport5 homepage...");
    const res = await fetch("https://www.sport5.co.il", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);

    const articles = [];
    const seenHrefs = new Set();

    $("a").each((i, el) => {
      const href = $(el).attr("href") || "";
      const rawText = $(el).text().replace(/\s+/g, " ").trim();
      if (
        href.includes("/articles.aspx?FolderID=") &&
        rawText.length > 20 &&
        !seenHrefs.has(href) &&
        articles.length < 6
      ) {
        seenHrefs.add(href);
        const fullUrl = href.startsWith("http") ? href : `https://www.sport5.co.il${href}`;
        // Look for image inside
        const img = $(el).find("img").attr("src") || $(el).closest("div").find("img").attr("src") || "";
        articles.push({
          sourceId: "sport5",
          sourceName: "ספורט 5",
          sourceLang: "he",
          isInternational: false,
          headline: rawText.split("\n")[0].trim().slice(0, 110),
          excerpt: rawText.slice(0, 200),
          originalUrl: fullUrl,
          imageUrl: img.startsWith("http") ? img : img ? `https://www.sport5.co.il${img}` : "",
          publishedAt: "עכשיו",
          pubDateTimestamp: Date.now(),
        });
      }
    });

    console.log(`• Retrieved ${articles.length} items from Sport5`);
    return articles;
  } catch (err) {
    console.warn("Sport5 fetch error:", err.message);
    return [];
  }
}

// Content Classifier: Classifies category and badge faithfully without false Israeli defaults
function classifyContent(headline, text, isInternational, sourceId) {
  const combined = (headline + " " + text).toLowerCase();

  // 1. Tennis & Olympic / Individual World Sports
  if (
    combined.includes("טניס") ||
    combined.includes("מדורגת") ||
    combined.includes("משחקון") ||
    combined.includes("גראנד סלאם") ||
    combined.includes("wta") ||
    combined.includes("atp") ||
    combined.includes("מרתון") ||
    combined.includes("ריצת")
  ) {
    let badge = "ספורט עולמי";
    if (combined.includes("טניס") || combined.includes("מדורגת")) badge = "טניס עולמי";
    else if (combined.includes("מרתון") || combined.includes("ריצת")) badge = "אתלטיקה";

    return {
      category: "global-stories",
      categoryLabel: "טניס וספורט עולמי",
      badge,
    };
  }

  // 2. Israeli Basketball
  if (
    combined.includes("חולון") ||
    combined.includes("קרוניץ'") ||
    combined.includes("קרוניץ") ||
    combined.includes("ווינר סל") ||
    combined.includes("הפועל י-ם") ||
    combined.includes("הפועל ירושלים") ||
    (combined.includes("כדורסל") && !combined.includes("nba") && !combined.includes("אירופה"))
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

  // 4. NBA & US Basketball
  if (
    sourceId === "espn" ||
    combined.includes("nba") ||
    combined.includes("דונצ'יץ'") ||
    combined.includes("doncic") ||
    combined.includes("curry") ||
    combined.includes("קרי") ||
    combined.includes("lebron") ||
    combined.includes("לייקרס") ||
    combined.includes("סלטיקס")
  ) {
    return {
      category: "nba",
      categoryLabel: "NBA",
      badge: "NBA",
    };
  }

  // 5. World & European Football (Cristiano Ronaldo, Mo Salah, Rangers, Maresca, Liverpool, etc.)
  const isWorldFootballKeyword =
    combined.includes("רונאלדו") ||
    combined.includes("כריסטיאנו") ||
    combined.includes("מסי") ||
    combined.includes("סאלח") ||
    combined.includes("salah") ||
    combined.includes("ריינג'רס") ||
    combined.includes("rangers") ||
    combined.includes("fa cup") ||
    combined.includes("הגביע האנגלי") ||
    combined.includes("פרמייר ליג") ||
    combined.includes("premier league") ||
    combined.includes("ליגת האלופות") ||
    combined.includes("champions league") ||
    combined.includes("ריאל מדריד") ||
    combined.includes("ברצלונה") ||
    combined.includes("ליברפול") ||
    combined.includes("סיטי") ||
    combined.includes("ארסנל") ||
    combined.includes("סקוטלנד") ||
    combined.includes("scotland") ||
    combined.includes("maresca");

  if (isInternational || isWorldFootballKeyword) {
    let badge = "כדורגל עולמי";
    if (combined.includes("fa cup") || combined.includes("הגביע האנגלי")) badge = "הגביע האנגלי • FA Cup";
    else if (combined.includes("ריינג'רס") || combined.includes("rangers")) badge = "סקוטלנד • Rangers";
    else if (combined.includes("פרמייר ליג") || combined.includes("premier league") || combined.includes("maresca") || combined.includes("סאלח") || combined.includes("salah")) badge = "פרמייר ליג";
    else if (combined.includes("רונאלדו") || combined.includes("כריסטיאנו")) badge = "כדורגל עולמי • רונאלדו";
    else if (combined.includes("אלופות") || combined.includes("champions")) badge = "ליגת האלופות";

    return {
      category: "uefa-tournaments",
      categoryLabel: "אירופה ומפעלים",
      badge,
    };
  }

  // 6. Israeli Football
  return {
    category: "israeli-football",
    categoryLabel: "כדורגל ישראלי",
    badge: "ליגת העל",
  };
}

// Determine Story Type: In-depth Story / Feature vs. Short Breaking News
function determineStoryType(headline, paragraphs) {
  const text = (headline + " " + paragraphs.join(" ")).toLowerCase();
  const totalLength = paragraphs.join(" ").length;

  const isEditorial =
    text.includes("ריאיון") ||
    text.includes("ראיון") ||
    text.includes("טור דעה") ||
    text.includes("טור:") ||
    text.includes("שיעור באלכימיה") ||
    text.includes("ניתוח") ||
    text.includes("מאחורי הקלעים") ||
    text.includes("מיוחד:") ||
    text.includes("אובריגדו") ||
    text.includes("הסיפור") ||
    text.includes("inside") ||
    text.includes("analysis");

  if (paragraphs.length >= 5 || totalLength > 1100 || isEditorial) {
    return "story"; // Magazine / Story -> TTL 7 days
  }

  return "breaking"; // Breaking update -> TTL 12 hours
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

    const pList = $("p, .text-content, .text-block, [itemprop='articleBody'] p, .article-content p")
      .map((i, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(t => t.length > 25 && !t.includes("cookie") && !t.includes("להורדת האפליקציה") && !t.includes("כל הזכויות"));

    return pList.slice(0, 15);
  } catch (err) {
    return [];
  }
}

// STRICT Entity Extraction from HEADLINE ONLY (Prevents mixing Doncic with Curry!)
function extractPrimaryHeadlineEntity(headline) {
  const h = headline.toLowerCase();

  // NBA distinct players:
  if (h.includes("דונצ'יץ'") || h.includes("דונציץ") || h.includes("doncic")) return "doncic";
  if (h.includes("קרי") || h.includes("curry")) return "curry";
  if (h.includes("לברון") || h.includes("james") || h.includes("lebron")) return "lebron";
  if (h.includes("פורזינגיס") || h.includes("porzingis")) return "porzingis";

  // Israeli football / coaches:
  if (h.includes("הפועל תל אביב") || h.includes("הפועל ת\"א") || h.includes("הפועל ת'א")) return "hapoel_ta";
  if (h.includes("מסאי דגו") || h.includes("ברוך דגו") || (h.includes("דגו") && h.includes("רמת גן"))) return "dego";
  if (h.includes("דניאל פרץ") || (h.includes("פרץ") && h.includes("צור"))) return "daniel_peretz";
  if (h.includes("בכר") || h.includes("ברק בכר")) return "barak_bachar";
  if (h.includes("יצחקי") || h.includes("ברק יצחקי")) return "itzhaki";
  if (h.includes("באר שבע") || h.includes("ב\"ש")) return "hapoel_bs";
  if (h.includes("חיפה") && h.includes("עודה")) return "hapoel_haifa_ref";

  // Basketball:
  if (h.includes("חולון") || h.includes("קרוניץ'") || h.includes("קרוניץ")) return "holon_krunic";

  // European / World football:
  if (h.includes("maresca") || h.includes("מרסקה")) return "maresca";
  if (h.includes("רונאלדו") || h.includes("כריסטיאנו")) return "ronaldo";
  if (h.includes("סאלח") || h.includes("salah")) return "salah";
  if (h.includes("ריינג'רס") || h.includes("rangers")) return "rangers";
  if (h.includes("fa cup") || h.includes("הגביע האנגלי")) return "fa_cup";

  // Tennis:
  if (h.includes("המדורגת מספר 1") || h.includes("המדורגת מספר") || h.includes("פרשה מהטורניר")) return "tennis_no1";

  return null;
}

async function run() {
  console.log("=== SportPulse Advanced Scraping, Clustering & Retention Engine ===");

  const rawArticles = [];

  // 1. Fetch RSS feeds (Walla, Ynet, BBC, ESPN)
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
            isInternational: feed.isInternational,
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

  // 2. Fetch Sport5 articles
  const sport5Articles = await fetchSport5Articles();
  rawArticles.push(...sport5Articles);

  console.log(`Gathered ${rawArticles.length} raw articles. Extracting full text via Readability...`);

  // Extract full paragraphs and classify
  for (const art of rawArticles) {
    const fullParagraphs = await extractFullArticle(art.originalUrl);
    art.contentParagraphs = fullParagraphs.length > 0 ? fullParagraphs : [art.excerpt];

    // Accurate category & badge classification (No broken fallbacks!)
    const classification = classifyContent(art.headline, art.excerpt, art.isInternational, art.sourceId);
    art.category = classification.category;
    art.categoryLabel = classification.categoryLabel;
    art.badge = classification.badge;

    // Editorial vs Breaking classification
    art.storyType = determineStoryType(art.headline, art.contentParagraphs);

    // Primary entity from HEADLINE ONLY (strictly avoids mixing Doncic & Curry!)
    art.primaryEntity = extractPrimaryHeadlineEntity(art.headline);

    console.log(`• [${art.sourceName}] "${art.headline.slice(0, 32)}..." -> [${art.categoryLabel}] [${art.badge}] [${art.storyType.toUpperCase()}]`);
  }

  console.log("Clustering based strictly on Primary Headline Entities...");

  const clusteredStories = [];
  const processedArticles = new Set();

  for (let i = 0; i < rawArticles.length; i++) {
    if (processedArticles.has(i)) continue;
    const current = rawArticles[i];
    processedArticles.add(i);

    const matchingArticles = [current];

    // Merge siblings ONLY if they share the exact primary headline entity
    if (current.primaryEntity) {
      for (let j = i + 1; j < rawArticles.length; j++) {
        if (processedArticles.has(j)) continue;
        const candidate = rawArticles[j];

        if (
          candidate.primaryEntity === current.primaryEntity &&
          candidate.sourceId !== current.sourceId
        ) {
          matchingArticles.push(candidate);
          processedArticles.add(j);
          console.log(`  🔗 STRICT MERGE [${current.primaryEntity}]: [${current.sourceName}] + [${candidate.sourceName}]`);
        }
      }
    }

    const storyId = `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
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

  // 12-Hour Retention Policy for Breaking News
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  console.log("Applying Retention Policy (Breaking: 12h, Magazine: 7d)...");

  const existingDocs = await getDocs(collection(db, "stories"));
  let purgedCount = 0;

  for (const docSnap of existingDocs.docs) {
    const data = docSnap.data();
    const createdMs = data.createdAt?.toMillis?.() || 0;
    const age = now - createdMs;

    // Purge breaking news after 12 hours
    if (data.storyType === "breaking" && age > TWELVE_HOURS_MS) {
      await deleteDoc(docSnap.ref);
      purgedCount++;
    } else if (data.storyType === "story" && age > SEVEN_DAYS_MS) {
      await deleteDoc(docSnap.ref);
      purgedCount++;
    }
  }

  // Clear stale items for a fresh synchronized feed
  for (const docSnap of existingDocs.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Save new strictly validated stories
  for (let i = 0; i < clusteredStories.length; i++) {
    const story = clusteredStories[i];
    const storyRef = doc(db, "stories", story.id);
    await setDoc(storyRef, {
      ...story,
      createdAt: Timestamp.fromMillis(now - i * 60000),
    });
    console.log(`✓ Saved [${story.categoryLabel}] [${story.competitionBadge}] [${story.storyType}] "${story.headline.slice(0, 35)}..." (${story.articles.length} sources)`);
  }

  console.log("=== Synchronization complete! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("Fatal pipeline error:", err);
  process.exit(1);
});
