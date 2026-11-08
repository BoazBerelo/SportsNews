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
    category: "israeli-football",
    url: "https://rss.walla.co.il/feed/156",
  },
  {
    sourceId: "ynet",
    sourceName: "Ynet ספורט",
    sourceLang: "he",
    category: "israeli-football",
    url: "https://www.ynet.co.il/Integration/StoryRss3.xml",
  },
  {
    sourceId: "bbc",
    sourceName: "BBC Sport",
    sourceLang: "en",
    category: "uefa-tournaments",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
  },
  {
    sourceId: "espn",
    sourceName: "ESPN NBA",
    sourceLang: "en",
    category: "nba",
    url: "https://www.espn.com/espn/rss/nba/news",
  },
];

// High-precision Sports Entity & Alias Thesaurus (Bilingual)
const ENTITY_GROUPS = [
  {
    id: "doncic",
    unifiedTitle: "ההתפוצצות של לוקה דונצ'יץ': הצגת ענק ושיא עונתי של 53 נקודות",
    category: "nba",
    categoryLabel: "NBA",
    badge: "NBA • Regular Season",
    aliases: ["דונצ'יץ'", "דונציץ", "דונצ'יץ", "doncic", "luka doncic", "לוקה"]
  },
  {
    id: "curry",
    unifiedTitle: "סטף קרי שובר עוד שיא קריירה היסטורי עם מופע של 40+ נקודות",
    category: "nba",
    categoryLabel: "NBA",
    badge: "NBA • Milestones",
    aliases: ["קרי", "curry", "stephen curry", "steph", "סטף קרי"]
  },
  {
    id: "hapoel_ta",
    unifiedTitle: "הפועל תל אביב ואליניב ברדה בקרב על פסגת הכדורגל הישראלי",
    category: "israeli-football",
    categoryLabel: "כדורגל ישראלי",
    badge: "ליגת העל • מחזור צמרת",
    aliases: ["הפועל תל אביב", "הפועל ת\"א", "הפועל ת'א", "אליניב ברדה", "ברדה"]
  },
  {
    id: "dego_rg",
    unifiedTitle: "הפועל רמת גן ומסאי דגו: גיבוי מלא בהנהלה להמשך הדרך",
    category: "israeli-football",
    categoryLabel: "כדורגל ישראלי",
    badge: "הליגה הלאומית / גביע",
    aliases: ["מסאי דגו", "ברוך דגו", "דגו", "הפועל רמת גן", "הפועל ר\"ג", "רמת גן"]
  },
  {
    id: "holon_krunic",
    unifiedTitle: "זעזוע בהפועל חולון: המאמן פרדראג קרוניץ' סיים את תפקידו",
    category: "israeli-basketball",
    categoryLabel: "כדורסל ישראלי",
    badge: "ליגת ווינר סל",
    aliases: ["קרוניץ'", "קרוניץ", "חולון", "פרדראג", "הפועל חולון"]
  },
  {
    id: "daniel_peretz",
    unifiedTitle: "דניאל פרץ בריאיון מיוחד: התחרות על אפודת השוער והעתיד",
    category: "israeli-football",
    categoryLabel: "כדורגל ישראלי",
    badge: "ליגיונרים • בלעדי",
    aliases: ["דניאל פרץ", "פרץ", "צור עשה", "באיירן"]
  },
  {
    id: "chelsea_maresca",
    unifiedTitle: "משבר בצ'לסי: אנזו מרסקה מול ביקורות חריפות אחרי איבוד נקודות",
    category: "uefa-tournaments",
    categoryLabel: "פרמייר ליג",
    badge: "Premier League • Chelsea",
    aliases: ["maresca", "chelsea", "מרסקה", "צ'לסי"]
  },
];

// Extract full article paragraphs using Mozilla Readability
async function extractFullArticle(url, sourceId) {
  if (!url) return [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
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

    return pList.slice(0, 15); // Return up to 15 rich paragraphs
  } catch (err) {
    return [];
  }
}

// Find matching entity group for an article headline
function identifyEntityGroup(headline, text) {
  const combined = (headline + " " + text).toLowerCase();
  for (const group of ENTITY_GROUPS) {
    for (const alias of group.aliases) {
      if (combined.includes(alias.toLowerCase())) {
        return group;
      }
    }
  }
  return null;
}

async function run() {
  console.log("=== Running Intelligent Sports Clustering & Full Article Reader Sync ===");

  const rawArticles = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Scanning feed: ${feed.sourceName}...`);
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
            category: feed.category,
            publishedAt: item.pubDate ? new Date(item.pubDate).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) : "עכשיו",
          });
        }
      }
    } catch (e) {
      console.warn(`Error scanning ${feed.sourceName}:`, e.message);
    }
  }

  console.log(`Gathered ${rawArticles.length} raw articles.`);
  console.log("Extracting full article bodies via Mozilla Readability...");

  for (const art of rawArticles) {
    const fullParagraphs = await extractFullArticle(art.originalUrl, art.sourceId);
    art.contentParagraphs = fullParagraphs.length > 0 ? fullParagraphs : [art.excerpt];
    console.log(`• [${art.sourceName}] Extracted ${art.contentParagraphs.length} paragraphs for: "${art.headline.slice(0, 30)}..."`);
  }

  console.log("Clustering articles using Bilingual Entity Resolution...");

  const clusterMap = new Map();
  const independentStories = [];

  for (const art of rawArticles) {
    const entityGroup = identifyEntityGroup(art.headline, art.excerpt);

    if (entityGroup) {
      if (!clusterMap.has(entityGroup.id)) {
        clusterMap.set(entityGroup.id, {
          id: `cluster-${entityGroup.id}`,
          headline: entityGroup.unifiedTitle,
          summary: art.excerpt || entityGroup.unifiedTitle,
          imageUrl: art.imageUrl || "/default-story-bg.jpg",
          category: entityGroup.category,
          categoryLabel: entityGroup.categoryLabel,
          competitionBadge: entityGroup.badge,
          storyType: "breaking",
          updatedAt: "עודכן עכשיו",
          articles: [art],
        });
      } else {
        const existingCluster = clusterMap.get(entityGroup.id);
        // Only add if source isn't duplicated
        if (!existingCluster.articles.some(a => a.sourceId === art.sourceId)) {
          existingCluster.articles.push(art);
          console.log(`[MERGED CLUSTER] ${entityGroup.id.toUpperCase()}: Added ${art.sourceName} (${art.sourceLang}) into cluster with ${existingCluster.articles[0].sourceName}!`);
        }
      }
    } else {
      // Clean standalone story (no fake mixing!)
      const storyId = `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      independentStories.push({
        id: storyId,
        headline: art.headline,
        summary: art.excerpt || art.headline,
        imageUrl: art.imageUrl || "/default-story-bg.jpg",
        category: art.category,
        categoryLabel:
          art.category === "israeli-football" ? "כדורגל ישראלי" :
          art.category === "nba" ? "NBA" :
          art.category === "uefa-tournaments" ? "אירופה ומפעלים" : "ספורט עולמי",
        competitionBadge: art.category === "nba" ? "NBA" : art.category === "israeli-football" ? "ליגת העל" : "אירופה",
        storyType: "breaking",
        updatedAt: "עודכן עכשיו",
        articles: [art],
      });
    }
  }

  const finalStories = [...Array.from(clusterMap.values()), ...independentStories.slice(0, 8)];

  console.log(`Writing ${finalStories.length} curated, consolidated stories to Firestore...`);

  // Clear stale documents
  const existing = await getDocs(collection(db, "stories"));
  for (const docSnap of existing.docs) {
    await deleteDoc(docSnap.ref);
  }

  for (let i = 0; i < finalStories.length; i++) {
    const story = finalStories[i];
    const storyRef = doc(db, "stories", story.id);
    await setDoc(storyRef, {
      ...story,
      createdAt: Timestamp.fromMillis(Date.now() - i * 60000),
    });
    console.log(`✓ Synced: [${story.articles.length} sources] ${story.headline.slice(0, 45)}...`);
  }

  console.log("=== Pipeline finished successfully! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("Error in ingestion pipeline:", err);
  process.exit(1);
});
