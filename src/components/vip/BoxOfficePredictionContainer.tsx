'use client';

import React from 'react';
import { BoxOfficePredictionView } from './BoxOfficePredictionView';

export const BoxOfficePredictionContainer: React.FC = () => {
  return (
    <div className="w-full py-4 flex justify-center items-center">
      <BoxOfficePredictionView />
    </div>
  );
};
