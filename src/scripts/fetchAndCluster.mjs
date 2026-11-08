import { XMLParser } from "fast-xml-parser";
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

// Helper to extract real article text from webpage
async function fetchFullArticleParagraphs(url, sourceId) {
  if (!url) return [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timer);
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove scripts, ads, styles
    $("script, style, noscript, nav, header, footer, .ad-banner, .comments").remove();

    const paragraphs = [];
    $("article p, .article-content p, .article-body p, main p").each((i, el) => {
      const txt = $(el).text().replace(/\s+/g, " ").trim();
      if (
        txt.length > 35 &&
        !txt.includes("cookie") &&
        !txt.includes("כל הזכויות") &&
        !txt.includes("להורדת האפליקציה") &&
        !txt.includes("צילום:") &&
        !txt.includes("שתפו את הכתבה")
      ) {
        paragraphs.push(txt);
      }
    });

    return paragraphs.slice(0, 8); // top 8 real paragraphs
  } catch (err) {
    return [];
  }
}

// Extract named entities / keywords for strict clustering
function extractKeywords(title) {
  const clean = title.toLowerCase().replace(/['"״׳,.:;!?()-]/g, " ");
  const stopWords = new Set([
    "את", "על", "של", "אל", "עם", "לא", "כי", "גם", "הוא", "היא", "הם", "מה", "מי", "זה", "זו", "אחרי", "לפני", "בדרך", "ריאיון", "צפו", "הרגע", "מדוע", "איך", "שוב",
    "the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are", "as", "with", "from", "by", "after"
  ]);
  return clean.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
}

// Calculate strict similarity: only match if specific key entities/tokens overlap
function areArticlesAboutSameStory(a1, a2) {
  // If categories are completely different (e.g. Israeli football vs NBA), never cluster
  if (a1.category !== a2.category && !(a1.category === "israeli-football" && a2.category === "israeli-basketball")) {
    return false;
  }

  const k1 = extractKeywords(a1.headline);
  const k2 = extractKeywords(a2.headline);

  // Check specific named entity overlaps
  const overlap = k1.filter(word => k2.includes(word));
  
  // Need at least 2 significant shared entity words (e.g. "דניאל", "פרץ" or "קרוניץ", "חולון")
  return overlap.length >= 2;
}

async function run() {
  console.log("=== Starting Live News Ingestion & Strict Clustering ===");
  
  const rawArticles = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching feed: ${feed.sourceName}...`);
      const res = await fetch(feed.url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const xml = await res.text();
      const parsed = parser.parse(xml);
      const items = parsed?.rss?.channel?.item || [];
      const list = Array.isArray(items) ? items : [items];

      for (const item of list.slice(0, 5)) {
        const headline = String(item.title || "").trim();
        const excerpt = String(item.description || "").replace(/<[^>]*>?/gm, "").trim().slice(0, 220);
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
      console.warn(`Error fetching feed ${feed.sourceName}:`, e.message);
    }
  }

  console.log(`Gathered ${rawArticles.length} live raw articles.`);
  console.log("Extracting real article paragraphs from sources...");

  // Fetch real paragraphs for articles
  for (const art of rawArticles) {
    const paras = await fetchFullArticleParagraphs(art.originalUrl, art.sourceId);
    art.contentParagraphs = paras.length > 0 ? paras : [art.excerpt];
  }

  console.log("Performing STRICT entity-based clustering...");
  const clusters = [];

  for (const art of rawArticles) {
    let matchedCluster = null;

    for (const cluster of clusters) {
      // Check if this article matches any article already in the cluster
      const matchesAny = cluster.articles.some(existing => areArticlesAboutSameStory(existing, art));
      if (matchesAny) {
        matchedCluster = cluster;
        break;
      }
    }

    if (matchedCluster) {
      // Add article as an additional source tab to this existing story!
      matchedCluster.articles.push(art);
      console.log(`[CLUSTER MATCH] Grouped "${art.headline.slice(0, 30)}..." into cluster "${matchedCluster.headline.slice(0, 30)}..."`);
    } else {
      // Create new clean story cluster (single source or waiting for more)
      const storyId = `story-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      clusters.push({
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

  console.log(`Created ${clusters.length} distinct, strictly-verified story clusters.`);

  // Write new real stories to Firestore
  console.log("Clearing outdated stories and saving new live stories to Firestore...");
  const existingDocs = await getDocs(collection(db, "stories"));
  for (const docSnap of existingDocs.docs) {
    await deleteDoc(docSnap.ref);
  }

  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    const storyRef = doc(db, "stories", cluster.id);
    await setDoc(storyRef, {
      ...cluster,
      createdAt: Timestamp.fromMillis(Date.now() - i * 60000),
    });
    console.log(`✓ Saved real story ${cluster.id} (${cluster.articles.length} sources)`);
  }

  console.log("=== Ingestion and live sync complete! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("Pipeline failure:", err);
  process.exit(1);
});
