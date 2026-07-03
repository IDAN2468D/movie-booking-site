'use client';

import React, { useState } from 'react';
import { useBookingStore } from '@/lib/store';
import { FOOD_ITEMS } from '@/lib/constants';
import { FoodHeader } from '@/components/food/FoodHeader';
import { FoodCategoryFilter } from '@/components/food/FoodCategoryFilter';
import { FoodGrid } from '@/components/food/FoodGrid';

const foodItems = FOOD_ITEMS;

export default function FoodPage() {
  const [activeFoodCategory, setActiveFoodCategory] = useState('כל הפריטים');
  
  // Strict, atomic selectors to comply with the Unified AI Governance Standard (v4.1)
  const selectedFood = useBookingStore((state) => state.selectedFood);
  const updateFoodQuantity = useBookingStore((state) => state.updateFoodQuantity);

  const getQuantity = (id: number) => {
    return selectedFood.find((f) => f.id === id)?.quantity || 0;
  };

  const cartTotal = selectedFood.reduce((acc, current) => {
    const item = foodItems.find((f) => f.id === current.id);
    return acc + (item?.price || 0) * current.quantity;
  }, 0);

  const filteredItems = activeFoodCategory === 'כל הפריטים' 
    ? foodItems 
    : foodItems.filter(item => item.category === activeFoodCategory);

  return (
    <div className="p-10 pb-20 text-right">
      <FoodHeader cartTotal={cartTotal} />
      
      <FoodCategoryFilter 
        activeCategory={activeFoodCategory} 
        onSelect={setActiveFoodCategory} 
      />

      <FoodGrid 
        items={filteredItems} 
        getQuantity={getQuantity} 
        onUpdate={updateFoodQuantity} 
      />
    </div>
  );
}
