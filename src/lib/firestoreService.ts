import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Story } from "@/types/story";
import { MOCK_STORIES } from "@/data/mockStories";

const STORIES_COLLECTION = "stories";

/**
 * Fetch all stories from Firestore.
 * If empty, seeds with initial stories.
 */
export async function getStoriesFromFirestore(): Promise<Story[]> {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    const q = query(storiesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("Firestore stories collection is empty. Seeding initial stories...");
      await seedInitialStories();
      return MOCK_STORIES;
    }

    const stories: Story[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      stories.push({
        id: docSnap.id,
        headline: data.headline,
        summary: data.summary,
        imageUrl: data.imageUrl,
        imageCaption: data.imageCaption,
        category: data.category,
        categoryLabel: data.categoryLabel,
        competitionBadge: data.competitionBadge,
        storyType: data.storyType,
        updatedAt: data.updatedAt,
        readingTimeMinutes: data.readingTimeMinutes,
        isHero: data.isHero,
        articles: data.articles || [],
      });
    });

    return stories;
  } catch (error) {
    console.error("Error fetching stories from Firestore:", error);
    return MOCK_STORIES;
  }
}

/**
 * Real-time listener for stories from Firestore
 */
export function subscribeToStories(callback: (stories: Story[]) => void) {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    const q = query(storiesRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(MOCK_STORIES);
          return;
        }

        const stories: Story[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          stories.push({
            id: docSnap.id,
            headline: data.headline,
            summary: data.summary,
            imageUrl: data.imageUrl,
            imageCaption: data.imageCaption,
            category: data.category,
            categoryLabel: data.categoryLabel,
            competitionBadge: data.competitionBadge,
            storyType: data.storyType,
            updatedAt: data.updatedAt,
            readingTimeMinutes: data.readingTimeMinutes,
            isHero: data.isHero,
            articles: data.articles || [],
          });
        });
        callback(stories);
      },
      (error) => {
        console.error("Firestore listener error:", error);
        callback(MOCK_STORIES);
      }
    );
  } catch (err) {
    console.error("Failed to initialize Firestore listener:", err);
    callback(MOCK_STORIES);
    return () => {};
  }
}

/**
 * Seed initial stories to Firestore
 */
export async function seedInitialStories(): Promise<void> {
  try {
    for (let i = 0; i < MOCK_STORIES.length; i++) {
      const story = MOCK_STORIES[i];
      const storyRef = doc(db, STORIES_COLLECTION, story.id);
      await setDoc(
        storyRef,
        {
          ...story,
          createdAt: Timestamp.fromMillis(Date.now() - i * 3600000), // Stagger timestamps
        },
        { merge: true }
      );
    }
    console.log("Successfully seeded initial stories to Firestore!");
  } catch (error) {
    console.error("Error seeding stories to Firestore:", error);
  }
}
