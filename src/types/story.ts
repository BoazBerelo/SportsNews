export type SportCategory =
  | "all"
  | "israeli-football"
  | "european-football"
  | "uefa-tournaments"
  | "israeli-basketball"
  | "euroleague"
  | "nba"
  | "global-stories";

export type StoryType = "story" | "breaking";

export interface SourceArticle {
  sourceId: "sport5" | "one" | "walla" | "ynet" | "theathletic" | "espn" | "bbc" | "marca" | "guardian";
  sourceName: string;
  sourceLang: "he" | "en" | "es";
  headline: string;
  excerpt: string;
  author?: string;
  publishedAt: string;
  originalUrl?: string;
  takeaway?: string;
  contentParagraphs?: string[];
}

export interface Story {
  id: string;
  headline: string;
  summary: string;
  imageUrl: string;
  imageCaption?: string;
  category: SportCategory;
  categoryLabel: string;
  competitionBadge?: string;
  storyType: StoryType;
  updatedAt: string;
  readingTimeMinutes?: number;
  isHero?: boolean;
  articles: SourceArticle[];
}
