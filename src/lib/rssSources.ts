export interface RssFeedConfig {
  sourceId: "sport5" | "one" | "walla" | "ynet" | "theathletic" | "espn" | "bbc" | "marca" | "guardian";
  sourceName: string;
  sourceLang: "he" | "en" | "es";
  category: "israeli-football" | "uefa-tournaments" | "euroleague" | "nba" | "israeli-basketball" | "global-stories";
  feedUrl: string;
}

export const VERIFIED_RSS_FEEDS: RssFeedConfig[] = [
  // Israeli Football & Sports
  {
    sourceId: "sport5",
    sourceName: "ספורט 5",
    sourceLang: "he",
    category: "israeli-football",
    feedUrl: "https://www.sport5.co.il/Feeds/RSS.aspx?CategoryID=44",
  },
  {
    sourceId: "walla",
    sourceName: "וואלה! ספורט",
    sourceLang: "he",
    category: "israeli-football",
    feedUrl: "https://rss.walla.co.il/feed/156",
  },
  {
    sourceId: "ynet",
    sourceName: "Ynet ספורט",
    sourceLang: "he",
    category: "israeli-football",
    feedUrl: "https://www.ynet.co.il/Integration/StoryRss3.xml",
  },

  // Basketball & EuroLeague
  {
    sourceId: "sport5",
    sourceName: "ספורט 5",
    sourceLang: "he",
    category: "euroleague",
    feedUrl: "https://www.sport5.co.il/Feeds/RSS.aspx?CategoryID=405",
  },

  // European Football & UEFA Champions / Europa / Conference / Nations League
  {
    sourceId: "bbc",
    sourceName: "BBC Sport",
    sourceLang: "en",
    category: "uefa-tournaments",
    feedUrl: "https://feeds.bbci.co.uk/sport/football/rss.xml",
  },

  // NBA & Global Sports Features
  {
    sourceId: "espn",
    sourceName: "ESPN",
    sourceLang: "en",
    category: "nba",
    feedUrl: "https://www.espn.com/espn/rss/nba/news",
  },
  {
    sourceId: "guardian",
    sourceName: "The Guardian Sport",
    sourceLang: "en",
    category: "global-stories",
    feedUrl: "https://www.theguardian.com/sport/rss",
  },
];
