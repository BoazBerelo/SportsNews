"use client";

import React from "react";
import { Newspaper, Sparkles, Trophy, Bookmark } from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f14]/95 backdrop-blur-lg border-t border-[#212734] px-4 py-2 sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => onSelectTab("feed")}
          className={`flex flex-col items-center gap-1 py-1 transition ${
            currentTab === "feed" ? "text-gold font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Newspaper className="w-5 h-5" />
          <span className="text-[10px]">הפיד</span>
        </button>

        <button
          onClick={() => onSelectTab("stories")}
          className={`flex flex-col items-center gap-1 py-1 transition ${
            currentTab === "stories" ? "text-gold font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">מגזין עומק</span>
        </button>

        <button
          onClick={() => onSelectTab("leagues")}
          className={`flex flex-col items-center gap-1 py-1 transition ${
            currentTab === "leagues" ? "text-gold font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">ליגות ומפעלים</span>
        </button>

        <button
          onClick={() => onSelectTab("saved")}
          className={`flex flex-col items-center gap-1 py-1 transition ${
            currentTab === "saved" ? "text-gold font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px]">שמורים</span>
        </button>
      </div>
    </nav>
  );
};
