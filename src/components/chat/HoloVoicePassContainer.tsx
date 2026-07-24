'use client';

import React from 'react';
import { HoloVoicePassView } from './HoloVoicePassView';

export const HoloVoicePassContainer: React.FC = () => {
  return (
    <div className="w-full py-4 flex justify-center items-center">
      <HoloVoicePassView />
    </div>
  );
};
