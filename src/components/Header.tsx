"use client";

import React from "react";
import { RefreshCw, Bell } from "lucide-react";

interface HeaderProps {
  lastUpdatedText: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdatedText,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-b border-[#212734] px-4 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Brand & Live status */}
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
              <span>איחוד ספורט חי</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{lastUpdatedText}</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-[#161a22] border border-[#293142] text-gray-300 hover:text-gold hover:border-gold/40 transition active:scale-95 disabled:opacity-50"
            title="רענן נתונים"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-gold" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
