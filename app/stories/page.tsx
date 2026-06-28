'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MovieStoryView, Story } from '@/components/stories/MovieStoryView';

const MOCK_STORIES: Story[] = [
  {
    id: '1',
    movieTitle: 'Dune: Part Two',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqut1V.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
  {
    id: '2',
    movieTitle: 'Oppenheimer',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    movieTitle: 'The Batman',
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  }
];

export default function StoriesPage() {
  const router = useRouter();
  const [showStories, setShowStories] = useState(true);

  if (!showStories) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070B] text-white">
        <h1 className="text-3xl mb-4">Stories Closed</h1>
        <button 
          onClick={() => setShowStories(true)}
          className="px-6 py-3 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors"
        >
          Open Stories Again
        </button>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <MovieStoryView 
      stories={MOCK_STORIES} 
      onClose={() => setShowStories(false)} 
    />
  );
}
