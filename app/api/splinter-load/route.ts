import { NextResponse } from "next/server";
import { z } from "zod";

const LoadQuerySchema = z.object({
  movieId: z.string().optional(),
});

export interface EdgeNodeLoad {
  id: string;
  region: string;
  activeRequests: number;
  capacityPct: number; // 0-100
  latencyMs: number;
  status: "optimal" | "warning" | "critical";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = LoadQuerySchema.safeParse({
      movieId: searchParams.get("movieId") || undefined,
    });

    if (!query.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    // Simulate real-time predictive splintering calculations across 3 global Edge nodes
    const now = Date.now();
    const timeFactor = Math.sin(now / 4000);

    const baseEU = 45 + Math.floor(timeFactor * 25);
    const baseUS = 65 - Math.floor(timeFactor * 20);
    const baseASIA = 30 + Math.floor(Math.cos(now / 5000) * 15);

    const nodes: EdgeNodeLoad[] = [
      {
        id: "node-eu-west",
        region: "EU West (London)",
        activeRequests: Math.floor(baseEU * 14.5),
        capacityPct: Math.min(99, Math.max(10, baseEU)),
        latencyMs: 12 + Math.floor(Math.random() * 5),
        status: baseEU > 85 ? "critical" : baseEU > 60 ? "warning" : "optimal",
      },
      {
        id: "node-us-east",
        region: "US East (N. Virginia)",
        activeRequests: Math.floor(baseUS * 18.2),
        capacityPct: Math.min(99, Math.max(10, baseUS)),
        latencyMs: 38 + Math.floor(Math.random() * 8),
        status: baseUS > 85 ? "critical" : baseUS > 60 ? "warning" : "optimal",
      },
      {
        id: "node-asia-south",
        region: "ASIA East (Tokyo)",
        activeRequests: Math.floor(baseASIA * 11.8),
        capacityPct: Math.min(99, Math.max(10, baseASIA)),
        latencyMs: 85 + Math.floor(Math.random() * 12),
        status: baseASIA > 85 ? "critical" : baseASIA > 60 ? "warning" : "optimal",
      },
    ];

    const totalRequests = nodes.reduce((sum, n) => sum + n.activeRequests, 0);

    return NextResponse.json({
      success: true,
      data: {
        timestamp: now,
        totalActiveRequests: totalRequests,
        predictedSpikePct: Math.round(15 + Math.abs(timeFactor) * 45),
        nodes,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error in splinter load calculation" },
      { status: 500 }
    );
  }
}
