"use client";

import React from "react";
import { SportCategory } from "@/types/story";
import { Flame, Trophy, Globe, Shield, Zap, Activity, BookOpen } from "lucide-react";

interface CategoryBarProps {
  selectedCategory: SportCategory;
  onSelectCategory: (category: SportCategory) => void;
}

const CATEGORY_ITEMS: { id: SportCategory; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "הכל", icon: <Flame className="w-3.5 h-3.5" /> },
  { id: "israeli-football", label: "כדורגל ישראלי", icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: "uefa-tournaments", label: "אירופה ומפעלים", icon: <Globe className="w-3.5 h-3.5" /> },
  { id: "euroleague", label: "יורוליג", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "nba", label: "NBA", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "israeli-basketball", label: "כדורסל ישראלי", icon: <Activity className="w-3.5 h-3.5" /> },
  { id: "global-stories", label: "טניס וספורט עולמי", icon: <BookOpen className="w-3.5 h-3.5" /> },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4 bg-[#0d0f14]">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORY_ITEMS.map((item) => {
          const isActive = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0d0f14] font-bold shadow-md shadow-gold/20 scale-105"
                  : "bg-[#161a22] text-gray-300 border border-[#212734] hover:border-gray-600 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
