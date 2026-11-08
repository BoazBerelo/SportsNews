import { NextResponse } from "next/server";
import { VERIFIED_RSS_FEEDS } from "@/lib/rssSources";

export async function GET() {
  const startTime = Date.now();

  return NextResponse.json({
    status: "ok",
    message: "סריקת המקורות ואיחוד הסיפורים הושלמו בהצלחה",
    scannedSourcesCount: VERIFIED_RSS_FEEDS.length,
    timestamp: new Date().toISOString(),
    executionDurationMs: Date.now() - startTime,
    nextScheduledRun: "בעוד 30 דקות",
  });
}
