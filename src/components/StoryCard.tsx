"use client";

import React, { useState } from "react";
import { Story, SourceArticle } from "@/types/story";
import {
  Layers,
  Clock,
  Sparkles,
  ChevronLeft,
  BookOpen,
} from "lucide-react";

interface StoryCardProps {
  story: Story;
  onOpenDetails: (story: Story, selectedArticle: SourceArticle) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onOpenDetails }) => {
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const currentArticle = story.articles[selectedSourceIndex] || story.articles[0];

  const getSourceBadgeColor = (sourceId: string) => {
    switch (sourceId) {
      case "sport5":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "one":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      case "theathletic":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "marca":
        return "bg-orange-600/20 text-orange-400 border-orange-500/30";
      case "espn":
        return "bg-red-700/20 text-red-300 border-red-600/30";
      case "bbc":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "guardian":
        return "bg-cyan-600/20 text-cyan-300 border-cyan-500/30";
      case "walla":
        return "bg-indigo-600/20 text-indigo-300 border-indigo-500/30";
      case "ynet":
        return "bg-rose-600/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-gray-700/30 text-gray-300 border-gray-600/30";
    }
  };

  return (
    <article className="group relative bg-[#161a22] rounded-2xl border border-[#212734] overflow-hidden transition-all duration-300 hover:border-gold/40 shadow-lg mb-4">
      {/* Media & Badges Section */}
      <div 
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/40 cursor-pointer"
        onClick={() => onOpenDetails(story, currentArticle)}
      >
        <img
          src={story.imageUrl || "/default-story-bg.jpg"}
          alt={story.headline}
          onError={(e) => {
            e.currentTarget.src = "/default-story-bg.jpg";
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161a22] via-[#161a22]/30 to-black/60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {story.competitionBadge && (
              <span className="text-[11px] font-semibold bg-black/70 backdrop-blur-md text-gray-200 px-2.5 py-1 rounded-full border border-white/10">
                {story.competitionBadge}
              </span>
            )}
            {story.storyType === "story" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gold text-[#0d0f14] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                מגזין עומק
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/90 text-white px-2 py-0.5 rounded-full">
                מבזק
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[11px] text-gray-300 border border-white/10">
            <Clock className="w-3 h-3 text-gold" />
            <span>{story.updatedAt}</span>
          </div>
        </div>

        {/* Multi-source indicator badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#0d0f14]/85 backdrop-blur-md text-gold px-2.5 py-1 rounded-full border border-gold/30 text-[11px] font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>{story.articles.length} מקורות</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5">
        {/* Unified Headline */}
        <h2 
          className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight leading-snug hover:text-gold transition-colors cursor-pointer"
          onClick={() => onOpenDetails(story, currentArticle)}
        >
          {story.headline}
        </h2>

        {/* Executive Summary */}
        <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
          {story.summary}
        </p>

        {/* Clean Source Tabs (No redundant labels) */}
        <div className="mt-4 pt-3 border-t border-[#212734]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {story.articles.map((article, idx) => {
              const isSelected = idx === selectedSourceIndex;
              return (
                <button
                  key={article.sourceId + idx}
                  onClick={() => setSelectedSourceIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-gold text-[#0d0f14] border-gold font-bold shadow-sm"
                      : "bg-[#0d0f14] text-gray-400 border-[#293142] hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  {article.sourceName}
                </button>
              );
            })}
          </div>

          {/* Active Source Perspective Box (Clickable directly into In-App Reader) */}
          <div 
            onClick={() => onOpenDetails(story, currentArticle)}
            className="mt-2.5 p-3 rounded-xl bg-[#0d0f14]/80 border border-[#212734] hover:border-[#2f384a] cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span
                className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSourceBadgeColor(
                  currentArticle.sourceId
                )}`}
              >
                {currentArticle.sourceName}
              </span>
              <span className="text-gray-400">
                {currentArticle.author ? `${currentArticle.author} • ` : ""}
                {currentArticle.publishedAt}
              </span>
            </div>

            {/* Source original headline */}
            <h4
              className="text-xs sm:text-sm font-semibold text-gray-100 line-clamp-2"
              dir={currentArticle.sourceLang === "en" || currentArticle.sourceLang === "es" ? "ltr" : "rtl"}
            >
              {currentArticle.headline}
            </h4>

            {/* Source excerpt */}
            <p
              className="mt-1 text-xs text-gray-400 line-clamp-2"
              dir={currentArticle.sourceLang === "en" || currentArticle.sourceLang === "es" ? "ltr" : "rtl"}
            >
              {currentArticle.excerpt}
            </p>
          </div>
        </div>

        {/* Footer Action: Stay In-App Reader */}
        <div className="mt-3.5 pt-2.5 border-t border-[#212734]/60 flex items-center justify-between">
          <button
            onClick={() => onOpenDetails(story, currentArticle)}
            className="flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold-light transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>לכתבה המלאה</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] text-gray-500">
            {story.articles.length} זוויות קריאה
          </span>
        </div>
      </div>
    </article>
  );
};
