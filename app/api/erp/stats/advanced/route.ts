import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { normalizeRawOrder, ISRAELI_VAT_RATE } from "@/lib/erp/stats/normalizer";
import { calculateSiteStats } from "@/lib/erp/stats/metricsCalculator";
import { detectAnomalies } from "@/lib/erp/stats/anomalyDetector";
import { RawOrderInput } from "@/lib/erp/stats/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const vatRate = parseFloat(searchParams.get('vatRate') || String(ISRAELI_VAT_RATE));

    const client = await clientPromise;
    const db = client.db();

    // Build date query if params provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (startDateParam && endDateParam) {
      query.createdAt = {
        $gte: new Date(`${startDateParam}T00:00:00.000Z`),
        $lte: new Date(`${endDateParam}T23:59:59.999Z`),
      };
    }

    const rawBookings = await db.collection("bookings")
      .find(query)
      .sort({ createdAt: 1 })
      .toArray();

    // Map DB documents to RawOrderInput
    const rawOrders: RawOrderInput[] = rawBookings.map((b) => ({
      orderId: b._id.toString(),
      date: b.createdAt || new Date(),
      movieTitle: b.movie?.title || b.movie?.displayTitle || "סרט לא ידוע",
      amount: b.total || 0,
      customerEmail: b.userEmail || "",
      status: b.status || "completed",
      quantity: Array.isArray(b.seats) ? b.seats.length : 1,
    }));

    const normalized = rawOrders.map((r, idx) => normalizeRawOrder(r, idx, vatRate));
    const calculated = calculateSiteStats(normalized, vatRate);
    calculated.anomalies = detectAnomalies(calculated.timeSeriesDaily);

    return NextResponse.json(calculated);
  } catch (error) {
    console.error("ERP Advanced Stats Error:", error);
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 });
  }
}
