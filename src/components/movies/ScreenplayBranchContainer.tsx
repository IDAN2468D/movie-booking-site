'use client';

import React from 'react';
import { ScreenplayBranchView } from './ScreenplayBranchView';

export const ScreenplayBranchContainer: React.FC = () => {
  return (
    <div className="w-full py-4 flex justify-center items-center">
      <ScreenplayBranchView />
    </div>
  );
};
