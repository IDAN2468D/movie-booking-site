'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { Movie } from '../tmdb';

export async function getFavorites(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });
    
    return { success: true, data: user?.favorites || [] };
  } catch (error: any) {
    console.error('Failed to get favorites from DB:', error);
    return { success: false, error: error.message || 'Failed to fetch favorites' };
  }
}

export async function toggleFavoriteInDb(userId: string, movie: Movie) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const favorites: Movie[] = user.favorites || [];
    const isFav = favorites.some((m) => m.id === movie.id);
    
    let updatedFavorites: Movie[];
    if (isFav) {
      updatedFavorites = favorites.filter((m) => m.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { favorites: updatedFavorites } }
    );
    
    return { success: true, data: updatedFavorites };
  } catch (error: any) {
    console.error('Failed to update favorite in DB:', error);
    return { success: false, error: error.message || 'Failed to update favorite' };
  }
}
