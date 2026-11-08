"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { StoryCard } from "@/components/StoryCard";
import { StoryDetailModal } from "@/components/StoryDetailModal";
import { BottomNav } from "@/components/BottomNav";
import { MOCK_STORIES } from "@/data/mockStories";
import { SportCategory, Story, SourceArticle } from "@/types/story";
import { subscribeToStories } from "@/lib/firestoreService";
import { Filter, CloudCheck } from "lucide-react";

export default function Home() {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [selectedCategory, setSelectedCategory] = useState<SportCategory>("all");
  const [activeFeedTab, setActiveFeedTab] = useState<"all" | "breaking" | "stories">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("עודכן עכשיו");
  const [activeModalStory, setActiveModalStory] = useState<Story | null>(null);
  const [activeModalArticle, setActiveModalArticle] = useState<SourceArticle | null>(null);
  const [currentBottomTab, setCurrentBottomTab] = useState("feed");
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToStories((firestoreStories) => {
      if (firestoreStories && firestoreStories.length > 0) {
        setStories(firestoreStories);
        setIsFirestoreConnected(true);
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
      const res = await fetch("/api/refresh");
      const data = await res.json();
      if (data.status === "success") {
        setLastUpdatedText("עודכן עכשיו מסונכרן");
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
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

  // Filter stories based on selected category & feed tab
  const filteredStories = stories.filter((story) => {
    // Category filter
    if (selectedCategory !== "all" && story.category !== selectedCategory) {
      return false;
    }

    // Feed tab filter
    if (activeFeedTab === "breaking" && story.storyType !== "breaking") {
      return false;
    }
    if (activeFeedTab === "stories" && story.storyType !== "story") {
      return false;
    }

    // Bottom nav tab filter
    if (currentBottomTab === "stories" && story.storyType !== "story") {
      return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-[#0d0f14] pb-24 sm:pb-12 max-w-2xl mx-auto border-x border-[#212734]/40 shadow-2xl">
      {/* Sticky Header */}
      <Header
        lastUpdatedText={lastUpdatedText}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        activeFeedTab={activeFeedTab}
        onSelectFeedTab={setActiveFeedTab}
      />

      {/* Horizontal Category Chips */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Live Firestore Ingestion Banner */}
      <div className="mx-4 my-3 p-3 rounded-xl bg-[#161a22] border border-gold/20 flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            מחובר ל-<strong>Firestore</strong> • נסרקו <strong>14 מקורות</strong> מהארץ והעולם • <strong>{stories.length} סיפורי ליבה</strong> מאוחדים
          </span>
        </div>
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
          <div className="py-16 text-center text-gray-400">
            <Filter className="w-10 h-10 mx-auto text-gray-600 mb-3" />
            <p className="text-base font-semibold">לא נמצאו סיפורים בקטגוריה זו כרגע</p>
            <p className="text-xs text-gray-500 mt-1">
              נסה לבחור קטגוריה אחרת או לעבור לפיד "כל העדכונים"
            </p>
          </div>
        )}
      </div>

      {/* In-App Story Detail / Reader Modal */}
      <StoryDetailModal
        story={activeModalStory}
        initialArticle={activeModalArticle}
        onClose={handleCloseDetails}
      />

      {/* Bottom PWA Navigation */}
      <BottomNav
        currentTab={currentBottomTab}
        onSelectTab={setCurrentBottomTab}
      />
    </main>
  );
}
