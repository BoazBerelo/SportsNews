"use client";

import React from "react";
import { Newspaper, Zap, Sparkles, Bookmark } from "lucide-react";

interface BottomNavProps {
  currentTab: "feed" | "breaking" | "stories" | "saved";
  onSelectTab: (tab: "feed" | "breaking" | "stories" | "saved") => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f14]/98 backdrop-blur-xl border-t border-[#212734] px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. All Feed */}
        <button
          onClick={() => onSelectTab("feed")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
            currentTab === "feed"
              ? "text-gold font-bold bg-[#1e2433] border border-gold/30 shadow-sm scale-105"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Newspaper className={`w-5 h-5 ${currentTab === "feed" ? "text-gold" : ""}`} />
          <span className="text-[11px] tracking-tight">כל הפיד</span>
        </button>

        {/* 2. Breaking News */}
        <button
          onClick={() => onSelectTab("breaking")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
            currentTab === "breaking"
              ? "text-amber-400 font-bold bg-[#1e2433] border border-amber-400/30 shadow-sm scale-105"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Zap className={`w-5 h-5 ${currentTab === "breaking" ? "text-amber-400 fill-amber-400/20" : ""}`} />
          <span className="text-[11px] tracking-tight">מבזקים</span>
        </button>

        {/* 3. In-Depth Stories / Magazine */}
        <button
          onClick={() => onSelectTab("stories")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
            currentTab === "stories"
              ? "text-gold font-bold bg-[#1e2433] border border-gold/30 shadow-sm scale-105"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sparkles className={`w-5 h-5 ${currentTab === "stories" ? "text-gold fill-gold/20" : ""}`} />
          <span className="text-[11px] tracking-tight">סיפורי עומק</span>
        </button>

        {/* 4. Bookmarks / Saved */}
        <button
          onClick={() => onSelectTab("saved")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 relative ${
            currentTab === "saved"
              ? "text-gold font-bold bg-[#1e2433] border border-gold/30 shadow-sm scale-105"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${currentTab === "saved" ? "text-gold fill-gold/20" : ""}`} />
          <span className="text-[11px] tracking-tight">שמורים</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-gold text-[#0d0f14] text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
