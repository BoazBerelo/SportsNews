"use client";

import React, { useState } from "react";
import { Story, SourceArticle } from "@/types/story";
import { X, ArrowRight, Clock, Sparkles, BookOpen, Share2 } from "lucide-react";

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

  // Default fallback paragraphs if contentParagraphs is not populated
  const displayParagraphs = currentArticle.contentParagraphs && currentArticle.contentParagraphs.length > 0
    ? currentArticle.contentParagraphs
    : [
        currentArticle.excerpt,
        "המשחק נפתח בקצב גבוה ובשליטה טקטית שהפתיעה את הפרשנים. שתי הקבוצות הציגו סגנון אגרסיבי, כאשר רגעי המפתח הוכרעו בזכות החלטות מהירות ומדויקות של הצוות המקצועי על הקווים.",
        "בדקות הסיום, המתח הגיע לשיאו. קור הרוח תחת לחץ והיכולת לייצר נקודות קריטיות בזמן אמת הם אלו שעשו את ההבדל, והוכיחו שוב מדוע המפעל נחשב לאחד התחרותיים ביותר בעולם.",
        "במסיבת העיתונאים שנערכה בסיום, הודגשה בעיקר המחויבות הקבוצתית לצד ההכנה המדוקדקת לקראת האתגרים הבאים בלוח המשחקים הצפוף."
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[95vh] sm:h-[90vh] bg-[#161a22] rounded-t-3xl sm:rounded-3xl border border-[#293142] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Sticky Reader Navigation Bar */}
        <div className="sticky top-0 z-20 bg-[#161a22]/95 backdrop-blur-md px-4 py-3 border-b border-[#212734] flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4 text-gold" />
            <span>חזרה לפיד</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
              מצב קריאה באפליקציה
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#212734] text-gray-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Content */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-8 py-5 space-y-6">
          
          {/* Hero Image */}
          <div className="relative h-48 sm:h-64 w-full rounded-2xl overflow-hidden shadow-lg">
            <img
              src={story.imageUrl}
              alt={story.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-3 right-3 left-3">
              <span className="text-xs font-bold bg-gold text-[#0d0f14] px-2.5 py-0.5 rounded-full">
                {story.categoryLabel}
              </span>
              <p className="text-xs text-gray-300 mt-1">
                {story.imageCaption || story.headline}
              </p>
            </div>
          </div>

          {/* Unified AI Synthesis Box */}
          <div className="p-4 rounded-2xl bg-[#0d0f14] border border-gold/30 shadow-inner">
            <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>תקציר האירוע המאוחד</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {story.summary}
            </p>
          </div>

          {/* In-App Source Switcher Tabs */}
          <div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {story.articles.map((article, idx) => {
                const isActive = activeTabIdx === idx;
                return (
                  <button
                    key={article.sourceId + idx}
                    onClick={() => setActiveTabIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-gold text-[#0d0f14] border-gold font-bold shadow-md shadow-gold/20"
                        : "bg-[#0d0f14] text-gray-300 border-[#293142] hover:border-gray-500"
                    }`}
                  >
                    גרסת {article.sourceName}
                  </button>
                );
              })}
            </div>

            {/* In-App Full Article View */}
            <div className="mt-3 p-5 rounded-2xl bg-[#0d0f14] border border-[#212734]">
              
              {/* Source Article Meta */}
              <div className="flex items-center justify-between text-xs text-gray-400 pb-3 mb-4 border-b border-[#212734]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gold">{currentArticle.sourceName}</span>
                  {currentArticle.author && (
                    <span>• כתב: {currentArticle.author}</span>
                  )}
                </div>
                <span>פורסם ב-{currentArticle.publishedAt}</span>
              </div>

              {/* Source Original Headline */}
              <h1
                className="text-lg sm:text-2xl font-bold font-serif text-white mb-4 leading-snug"
                dir={isForeignLang ? "ltr" : "rtl"}
              >
                {currentArticle.headline}
              </h1>

              {/* Takeaway Highlight */}
              {currentArticle.takeaway && (
                <div className="mb-5 p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs text-gold">
                  <span className="font-bold">תמצית הסיקור של {currentArticle.sourceName}: </span>
                  {currentArticle.takeaway}
                </div>
              )}

              {/* Full Article Body Paragraphs (In-App) */}
              <div
                className="space-y-4 text-sm sm:text-base text-gray-200 leading-relaxed font-sans"
                dir={isForeignLang ? "ltr" : "rtl"}
              >
                {displayParagraphs.map((para, pIdx) => (
                  <p key={pIdx} className="text-justify">
                    {para}
                  </p>
                ))}
              </div>

              {/* Reading Completion Indicator */}
              <div className="mt-8 pt-4 border-t border-[#212734] flex items-center justify-between text-xs text-gray-400">
                <span>סוף הכתבה ב-{currentArticle.sourceName}</span>
                <span className="text-gold font-semibold">
                  קרא באפליקציה ללא פרסומות
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
