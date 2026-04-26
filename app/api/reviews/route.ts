import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

const ReviewSchema = z.object({
  movieId: z.string(),
  movieTitle: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = ReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        error: "Invalid review data", 
        details: result.error.format() 
      }, { status: 400 });
    }

    const { movieId, movieTitle, rating, comment } = result.data;

    const client = await clientPromise;
    const db = client.db();

    const review = {
      movieId,
      movieTitle,
      userId: session.user.id,
      userName: session.user.name || "אנונימי",
      userImage: session.user.image || null,
      rating,
      comment,
      createdAt: new Date(),
    };

    const reviewResult = await db.collection("reviews").insertOne(review);

    return NextResponse.json({ 
      success: true, 
      reviewId: reviewResult.insertedId.toString() 
    }, { status: 201 });

  } catch (error) {
    console.error("Review POST Error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const reviews = await db
      .collection("reviews")
      .find({ movieId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        userName: r.userName,
        userImage: r.userImage,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }))
    });

  } catch (error) {
    console.error("Review GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
