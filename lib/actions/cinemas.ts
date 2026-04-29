'use server';

import clientPromise from '@/lib/mongodb';

export interface Cinema {
  _id: string;
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  region: string;
  image: string;
  feature: string;
  lat: number;
  lng: number;
  phone: string;
  rating: number;
  facilities: string[];
  hours: string;
  halls: {
    name: string;
    capacity: number;
    type: string;
  }[];
}

export async function getCinemas() {
  try {
    const client = await clientPromise;
    const db = client.db('movie-booking');
    const cinemas = await db.collection('cinemas').find({}).toArray();
    
    const DEFAULT_CINEMA_IMAGE = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400";

    const formattedCinemas = JSON.parse(JSON.stringify(cinemas)).map((c: any) => {
      // Robust image check
      const hasImage = c.image && typeof c.image === 'string' && c.image.trim() !== "" && c.image !== "undefined";
      return {
        ...c,
        id: c._id?.toString() || "",
        image: hasImage ? c.image : DEFAULT_CINEMA_IMAGE
      };
    }) as Cinema[];

    return { 
      success: true, 
      data: formattedCinemas
    };
  } catch (error) {
    console.error('Failed to fetch cinemas:', error);
    return { success: false, error: 'Failed to load cinemas' };
  }
}
