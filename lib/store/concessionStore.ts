import { create } from 'zustand';

export interface ConcessionItem {
  id: string;
  name: string;
  price: number;
  color: string;
}

interface ConcessionState {
  availableItems: ConcessionItem[];
  bucketItems: ConcessionItem[];
  ambientColor: string;
  addItemToBucket: (item: ConcessionItem) => void;
  removeItemFromBucket: (id: string) => void;
  setAvailableItems: (items: ConcessionItem[]) => void;
}

export const useConcessionStore = create<ConcessionState>((set) => ({
  availableItems: [],
  bucketItems: [],
  ambientColor: '#FF1464',
  addItemToBucket: (item) =>
    set((state) => ({
      bucketItems: [...state.bucketItems, item],
      ambientColor: item.color,
    })),
  removeItemFromBucket: (id) =>
    set((state) => {
      // Find the index of the first item with this id
      const index = state.bucketItems.findIndex((i) => i.id === id);
      if (index === -1) return state;
      const newBucket = [...state.bucketItems];
      newBucket.splice(index, 1);
      const newColor = newBucket.length > 0 ? newBucket[newBucket.length - 1].color : '#FF1464';
      return {
        bucketItems: newBucket,
        ambientColor: newColor,
      };
    }),
  setAvailableItems: (items) => set({ availableItems: items }),
}));

export const selectAvailableItems = (state: ConcessionState) => state.availableItems;
export const selectBucketItems = (state: ConcessionState) => state.bucketItems;
export const selectAmbientColor = (state: ConcessionState) => state.ambientColor;
export const selectAddItemToBucket = (state: ConcessionState) => state.addItemToBucket;
export const selectRemoveItemFromBucket = (state: ConcessionState) => state.removeItemFromBucket;
export const selectSetAvailableItems = (state: ConcessionState) => state.setAvailableItems;
