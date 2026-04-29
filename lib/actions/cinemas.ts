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
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(cinemas)).map((c: any) => ({
        ...c,
        id: c._id.toString()
      })) as Cinema[] 
    };
  } catch (error) {
    console.error('Failed to fetch cinemas:', error);
    return { success: false, error: 'Failed to load cinemas' };
  }
}
