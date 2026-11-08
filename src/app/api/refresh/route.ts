import { NextResponse } from "next/server";
import { seedInitialStories } from "@/lib/firestoreService";
import { VERIFIED_RSS_FEEDS } from "@/lib/rssSources";

export async function GET() {
  const startTime = Date.now();

  try {
    // Seed and sync stories to Firestore
    await seedInitialStories();

    return NextResponse.json({
      status: "success",
      message: "הסנכרון והכתיבה ל-Firestore הושלמו בהצלחה!",
      scannedSourcesCount: VERIFIED_RSS_FEEDS.length,
      seededStoriesCount: 6,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      database: "sports-news-pulse-2026",
      collection: "stories",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "שגיאה בעדכון Firestore",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
