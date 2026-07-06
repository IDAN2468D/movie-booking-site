import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const collection = db.collection('seatauctions');

    // Check if we already have auctions
    const count = await collection.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Auctions already seeded', count });
    }

    const now = new Date();
    // End time in 2 hours
    const endTime1 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    // End time in 5 hours
    const endTime2 = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    // End time in 10 minutes
    const endTime3 = new Date(now.getTime() + 10 * 60 * 1000);

    const seedData = [
      {
        movieId: '1',
        movieTitle: 'Dune: Part Three',
        moviePoster: 'https://image.tmdb.org/t/p/w500/1X7vow16X7CnCoexXh4H4F2yDJv.jpg', // Placeholder
        seatLabel: 'IMAX VIP Center (Row J, Seat 14)',
        startingBid: 1000,
        currentBid: 1200,
        highestBidder: null,
        highestBidderName: 'Sardaukar99',
        endTime: endTime1,
        status: 'active'
      },
      {
        movieId: '2',
        movieTitle: 'Spider-Man: Beyond the Spider-Verse',
        moviePoster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', // Placeholder
        seatLabel: 'Gold Lounge Couch 02',
        startingBid: 2500,
        currentBid: 3000,
        highestBidder: null,
        highestBidderName: 'WebSlinger_01',
        endTime: endTime2,
        status: 'active'
      },
      {
        movieId: '3',
        movieTitle: 'Avatar: Fire and Ash',
        moviePoster: 'https://image.tmdb.org/t/p/w500/jRXYjXNqOxcffIzyR3z6x6T876A.jpg', // Placeholder
        seatLabel: '4DX Ultimate Motion Seat A1',
        startingBid: 1500,
        currentBid: 1500,
        highestBidder: null,
        highestBidderName: null,
        endTime: endTime3,
        status: 'active'
      }
    ];

    await collection.insertMany(seedData);

    return NextResponse.json({ message: 'Seeded successfully', data: seedData });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
