"use client";

import React, { useState } from "react";
import { Story, SourceArticle } from "@/types/story";
import { ArrowRight, Clock, Sparkles, BookOpen, ExternalLink, X } from "lucide-react";

interface StoryDetailModalProps {
  story: Story | null;
  initialArticle: SourceArticle | null;
  onClose: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  initialArticle,
  onClose,
}) => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  if (!story) return null;

  const currentArticle = story.articles[activeTabIdx] || story.articles[0];
  const isForeignLang = currentArticle.sourceLang === "en" || currentArticle.sourceLang === "es";

  // Use only REAL paragraphs from the article. Never inject fake sports boilerplate.
  const paragraphs = currentArticle.contentParagraphs && currentArticle.contentParagraphs.length > 0
    ? currentArticle.contentParagraphs
    : currentArticle.excerpt
    ? [currentArticle.excerpt]
    : [story.summary];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-full sm:h-[94vh] bg-[#12161f] sm:rounded-3xl border border-[#293142] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#12161f]/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-[#212734] flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white transition active:scale-95"
          >
            <ArrowRight className="w-4 h-4 text-gold" />
            <span>חזרה לפיד</span>
          </button>

          {/* Quick source tabs right in header for fast switching */}
          {story.articles.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-[#0d0f14] p-1 rounded-xl border border-[#212734]">
              {story.articles.map((art, idx) => (
                <button
                  key={art.sourceId + idx}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    activeTabIdx === idx
                      ? "bg-gold text-[#0d0f14] font-bold shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {art.sourceName}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
              {story.categoryLabel}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#1e2430] text-gray-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-10 py-6 space-y-6">
          
          {/* Hero Banner */}
          <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden shadow-xl bg-black">
            <img
              src={story.imageUrl || "/default-story-bg.jpg"}
              alt={story.headline}
              onError={(e) => {
                e.currentTarget.src = "/default-story-bg.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-black/30 to-transparent" />
            
            <div className="absolute bottom-4 right-4 left-4">
              <span className="text-xs font-bold bg-gold text-[#0d0f14] px-2.5 py-1 rounded-full uppercase">
                {story.competitionBadge || story.categoryLabel}
              </span>
              <p className="text-xs text-gray-300 mt-2 line-clamp-1">
                {story.imageCaption || story.headline}
              </p>
            </div>
          </div>

          {/* Unified AI Synthesis Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f14] border border-gold/25 shadow-inner">
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>תמצית האירוע המאוחד</span>
            </div>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
              {story.summary}
            </p>
          </div>

          {/* Multiple Source Tabs (if more than 1 source) */}
          {story.articles.length > 1 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">
                מעבר בין סיקורי המקורות:
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {story.articles.map((art, idx) => {
                  const isActive = activeTabIdx === idx;
                  return (
                    <button
                      key={art.sourceId + idx}
                      onClick={() => setActiveTabIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        isActive
                          ? "bg-gold text-[#0d0f14] border-gold font-bold shadow-md shadow-gold/20"
                          : "bg-[#0d0f14] text-gray-300 border-[#293142] hover:border-gray-500"
                      }`}
                    >
                      סיקור {art.sourceName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* In-App Full Article Text Container */}
          <article className="p-5 sm:p-8 rounded-2xl bg-[#0d0f14] border border-[#212734] shadow-md">
            
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 pb-3 mb-4 border-b border-[#212734]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold text-sm">{currentArticle.sourceName}</span>
                {currentArticle.author && (
                  <span>• כתב: {currentArticle.author}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>פורסם ב-{currentArticle.publishedAt}</span>
              </div>
            </div>

            {/* Source Headline */}
            <h1
              className="text-xl sm:text-2xl font-bold font-serif text-white mb-5 leading-snug tracking-tight"
              dir={isForeignLang ? "ltr" : "rtl"}
            >
              {currentArticle.headline}
            </h1>

            {/* Takeaway / Perspective pill if exists */}
            {currentArticle.takeaway && (
              <div className="mb-6 p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-xs sm:text-sm text-gold">
                <span className="font-bold">דגש הסיקור: </span>
                {currentArticle.takeaway}
              </div>
            )}

            {/* Actual Article Body Paragraphs */}
            <div
              className="space-y-5 text-sm sm:text-base text-gray-200 leading-relaxed font-sans"
              dir={isForeignLang ? "ltr" : "rtl"}
            >
              {paragraphs.map((para, idx) => (
                <p key={idx} className="text-justify leading-7 sm:leading-8">
                  {para}
                </p>
              ))}
            </div>

            {/* Footer reader completion */}
            <div className="mt-8 pt-4 border-t border-[#212734] flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-gold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>קריאה נקייה ישירות באפליקציה</span>
              </span>
              {currentArticle.originalUrl && (
                <a
                  href={currentArticle.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-400 hover:text-white text-[11px] transition"
                >
                  <span>קישור למקור</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
