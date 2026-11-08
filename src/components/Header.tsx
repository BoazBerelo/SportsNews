"use client";

import React from "react";
import { RefreshCw, Sparkles, Bell, Bookmark } from "lucide-react";

interface HeaderProps {
  lastUpdatedText: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  activeFeedTab: "all" | "breaking" | "stories";
  onSelectFeedTab: (tab: "all" | "breaking" | "stories") => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdatedText,
  isRefreshing,
  onRefresh,
  activeFeedTab,
  onSelectFeedTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0f14]/90 backdrop-blur-md border-b border-[#212734] px-4 pt-3 pb-2 transition-all">
      {/* Top row: Brand & Quick actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#b88523] via-[#e6b042] to-[#f5c767] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0f14] rounded-[10px] flex items-center justify-center">
              <span className="text-gold font-black text-lg tracking-wider">SP</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                SportPulse
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#e6b042]/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <span>ריענון אוטומטי</span>
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{lastUpdatedText}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-[#161a22] border border-[#293142] text-gray-300 hover:text-gold hover:border-gold/40 transition active:scale-95 disabled:opacity-50"
            title="רענן נתונים כעת"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-gold" : ""}`}
            />
          </button>
          <button className="p-2 rounded-xl bg-[#161a22] border border-[#293142] text-gray-300 hover:text-white transition active:scale-95">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary row: Feed Mode Switcher (All / Breaking / Longform Stories) */}
      <div className="mt-3 flex items-center bg-[#161a22] p-1 rounded-xl border border-[#212734]">
        <button
          onClick={() => onSelectFeedTab("all")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeFeedTab === "all"
              ? "bg-[#212734] text-white shadow-sm font-bold border border-white/5"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          כל העדכונים
        </button>
        <button
          onClick={() => onSelectFeedTab("breaking")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeFeedTab === "breaking"
              ? "bg-[#212734] text-amber-400 shadow-sm font-bold border border-white/5"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          חדשות ומבזקים
        </button>
        <button
          onClick={() => onSelectFeedTab("stories")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeFeedTab === "stories"
              ? "bg-[#212734] text-gold shadow-sm font-bold border border-white/5"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sparkles className="w-3 h-3 text-gold" />
          סיפורי עומק ומגזין
        </button>
      </div>
    </header>
  );
};
