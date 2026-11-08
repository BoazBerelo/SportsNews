"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { StoryCard } from "@/components/StoryCard";
import { StoryDetailModal } from "@/components/StoryDetailModal";
import { BottomNav } from "@/components/BottomNav";
import { MOCK_STORIES } from "@/data/mockStories";
import { SportCategory, Story, SourceArticle } from "@/types/story";
import { subscribeToStories, getStoriesFromFirestore } from "@/lib/firestoreService";
import { Filter, Bookmark, Sparkles } from "lucide-react";

export default function Home() {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [selectedCategory, setSelectedCategory] = useState<SportCategory>("all");
  const [currentBottomTab, setCurrentBottomTab] = useState<"feed" | "breaking" | "stories" | "saved">("feed");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("עודכן עכשיו");
  const [activeModalStory, setActiveModalStory] = useState<Story | null>(null);
  const [activeModalArticle, setActiveModalArticle] = useState<SourceArticle | null>(null);
  const [savedStoryIds, setSavedStoryIds] = useState<string[]>([]);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToStories((firestoreStories) => {
      if (firestoreStories && firestoreStories.length > 0) {
        setStories(firestoreStories);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const latestStories = await getStoriesFromFirestore();
      if (latestStories && latestStories.length > 0) {
        setStories(latestStories);
        setLastUpdatedText("עודכן עכשיו מסונכרן");
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleOpenDetails = (story: Story, article: SourceArticle) => {
    setActiveModalStory(story);
    setActiveModalArticle(article);
  };

  const handleCloseDetails = () => {
    setActiveModalStory(null);
    setActiveModalArticle(null);
  };

  const handleSelectCategory = (cat: SportCategory) => {
    setSelectedCategory(cat);
  };

  // Filter stories based on selected category and bottom navigation tab
  const filteredStories = stories.filter((story) => {
    // 1. Bottom Nav filter
    if (currentBottomTab === "breaking" && story.storyType !== "breaking") {
      return false;
    }
    if (currentBottomTab === "stories" && story.storyType !== "story") {
      return false;
    }
    if (currentBottomTab === "saved" && !savedStoryIds.includes(story.id)) {
      return false;
    }

    // 2. Horizontal Category filter
    if (selectedCategory !== "all" && story.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-[#0d0f14] pb-24 max-w-2xl mx-auto border-x border-[#212734]/40 shadow-2xl">
      {/* Sleek, clean Header */}
      <Header
        lastUpdatedText={lastUpdatedText}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Horizontal Category Chips */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Live Status Pill */}
      <div className="mx-4 my-2.5 p-2.5 rounded-xl bg-[#161a22] border border-gold/20 flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            {currentBottomTab === "breaking" ? "מבזקים אחרונים (שנשמרים ל-12 שעות)" :
             currentBottomTab === "stories" ? "סיפורי עומק, טורי דעה ומגזין" :
             currentBottomTab === "saved" ? "הכתבות ששמרת לקריאה" :
             "כל הפיד המאוחד • ללא כפילויות"}
          </span>
        </div>
        <span className="text-[11px] text-gold font-bold">
          {filteredStories.length} פריטים
        </span>
      </div>

      {/* Story Feed */}
      <div className="px-4 mt-2">
        {filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onOpenDetails={handleOpenDetails}
            />
          ))
        ) : (
          <div className="py-20 text-center text-gray-400 px-6">
            {currentBottomTab === "saved" ? (
              <>
                <Bookmark className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <p className="text-base font-semibold text-gray-200">עדיין לא שמרת כתבות</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  תוכל לסמן כתבות למועדפים כדי לקרוא אותן מאוחר יותר בכל זמן שתרצה.
                </p>
              </>
            ) : (
              <>
                <Filter className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <p className="text-base font-semibold text-gray-200">לא נמצאו כתבות במדור זה</p>
                <p className="text-xs text-gray-500 mt-1">
                  נסה לבחור קטגוריה אחרת או לחזור ל"כל הפיד"
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* In-App Story Detail / Reader Modal */}
      <StoryDetailModal
        story={activeModalStory}
        initialArticle={activeModalArticle}
        onClose={handleCloseDetails}
      />

      {/* Permanent Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentBottomTab}
        onSelectTab={setCurrentBottomTab}
        savedCount={savedStoryIds.length}
      />
    </main>
  );
}
