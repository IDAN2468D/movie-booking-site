'use client';

import React from 'react';
import { SpatialCommentaryView } from './SpatialCommentaryView';

export const SpatialCommentaryContainer: React.FC = () => {
  return (
    <div className="w-full py-4 flex justify-center items-center">
      <SpatialCommentaryView />
    </div>
  );
};
