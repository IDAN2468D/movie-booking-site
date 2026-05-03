"use client";

import { useEffect, useState } from "react";
import { getStories } from "@/lib/actions/stories";
import StoryCircle from "./StoryCircle";
import StoryViewer, { StoryData } from "./StoryViewer";

export default function StoryBar() {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        setStories(data as StoryData[]);
      } catch (error) {
        console.error("Failed to load stories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleStoryViewed = (id: string) => {
    setStories((prev) =>
      prev.map((story) => (story._id === id ? { ...story, hasViewed: true } : story))
    );
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <div className="w-full relative py-4">
      {/* Horizontal Scrollable Container */}
      <div 
        className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        dir="rtl"
      >
        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
        `}} />
        
        {stories.map((story, index) => (
          <StoryCircle
            key={story._id}
            posterUrl={story.posterUrl}
            title={story.title}
            hasViewed={story.hasViewed}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {/* Full-screen Viewer */}
      {selectedIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onStoryViewed={handleStoryViewed}
        />
      )}
    </div>
  );
}
