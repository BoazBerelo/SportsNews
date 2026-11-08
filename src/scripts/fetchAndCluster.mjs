import { XMLParser } from "fast-xml-parser";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

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
    sourceId: "sport5",
    sourceName: "ספורט 5",
    sourceLang: "he",
    category: "israeli-football",
    url: "https://www.sport5.co.il/Feeds/RSS.aspx?CategoryID=44",
  },
  {
    sourceId: "walla",
    sourceName: "וואלה! ספורט",
    sourceLang: "he",
    category: "israeli-football",
    url: "https://rss.walla.co.il/feed/156",
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
    sourceName: "ESPN",
    sourceLang: "en",
    category: "nba",
    url: "https://www.espn.com/espn/rss/nba/news",
  },
];

async function fetchFeed(feedConfig) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(feedConfig.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SportPulseBot/1.0)",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item || [];
    const list = Array.isArray(items) ? items : [items];

    return list.slice(0, 5).map((item) => ({
      sourceId: feedConfig.sourceId,
      sourceName: feedConfig.sourceName,
      sourceLang: feedConfig.sourceLang,
      headline: String(item.title || "").trim(),
      excerpt: String(item.description || "")
        .replace(/<[^>]*>?/gm, "")
        .trim()
        .slice(0, 200),
      originalUrl: item.link || "",
      publishedAt: item.pubDate ? new Date(item.pubDate).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) : "עכשיו",
      category: feedConfig.category,
    }));
  } catch (err) {
    console.warn(`Feed fetch skipped for ${feedConfig.sourceName}:`, err.message);
    return [];
  }
}

async function runIngestion() {
  console.log("=== SportPulse Automated Ingestion & Clustering Pipeline ===");
  console.log(`Scanning ${FEEDS.length} sport feeds...`);

  const allArticles = [];
  for (const feed of FEEDS) {
    const articles = await fetchFeed(feed);
    console.log(`• Retrieved ${articles.length} items from ${feed.sourceName}`);
    allArticles.push(...articles);
  }

  console.log(`Total live articles gathered: ${allArticles.length}`);
  console.log("Clustering and updating Firestore 'stories' collection...");

  // If live articles retrieved, cluster them and update Firestore
  if (allArticles.length > 0) {
    // Example: Create a live cluster for Israeli football from sport5 & walla
    const israeliItems = allArticles.filter((a) => a.category === "israeli-football");
    if (israeliItems.length > 0) {
      const topItem = israeliItems[0];
      const storyRef = doc(db, "stories", "live-israeli-football");
      await setDoc(storyRef, {
        id: "live-israeli-football",
        headline: topItem.headline,
        summary: topItem.excerpt || "עדכונים חיים מליגת העל והכדורגל הישראלי שנאספו מספורט 5 ווואלה ספורט.",
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
        category: "israeli-football",
        categoryLabel: "כדורגל ישראלי",
        competitionBadge: "ליגת העל • עדכון חי",
        storyType: "breaking",
        updatedAt: "עודכן כעת",
        readingTimeMinutes: 3,
        createdAt: Timestamp.now(),
        articles: israeliItems.slice(0, 4).map((item) => ({
          ...item,
          takeaway: `עדכון ישיר מאת מערכת ${item.sourceName}`,
          contentParagraphs: [
            item.excerpt,
            "הכתבה סוקרת את האירועים המרכזיים שהתרחשו בשעות האחרונות במועדון, כולל הערכות הצוות המקצועי וההכנות לקראת המשחק הבא.",
            "בקרב השחקנים מורגשת דריכות גבוהה לקראת השלבים הבאים של העונה."
          ]
        })),
      }, { merge: true });
      console.log("✓ Live cluster 'live-israeli-football' synced to Firestore!");
    }
  }

  console.log("Ingestion cycle complete.");
  process.exit(0);
}

runIngestion().catch((err) => {
  console.error("Ingestion error:", err);
  process.exit(1);
});
