'use client';

import React from 'react';
import { FoodItem, FoodItemCard } from './FoodItemCard';

interface FoodGridProps {
  items: FoodItem[];
  getQuantity: (id: number) => number;
  onUpdate: (id: number, delta: number) => void;
}

export const FoodGrid: React.FC<FoodGridProps> = ({ items, getQuantity, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((item) => (
        <FoodItemCard
          key={item.id}
          item={item}
          quantity={getQuantity(item.id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
