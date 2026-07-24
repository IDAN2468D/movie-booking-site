'use client';

import React from 'react';
import { BiometricSeatView } from './BiometricSeatView';

export const BiometricSeatContainer: React.FC = () => {
  return (
    <div className="w-full py-4 flex justify-center items-center">
      <BiometricSeatView />
    </div>
  );
};
