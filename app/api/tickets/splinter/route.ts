import { NextRequest, NextResponse } from "next/server";
import { TicketSplinterRequestSchema } from "@/lib/validations/ticketSplinter";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_local_secret_for_splinters";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod boundary validation
    const parsed = TicketSplinterRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const { parentTicketId, count } = parsed.data;

    // Cryptographically secure splinter generation
    const splinters = [];
    for (let i = 0; i < count; i++) {
      const splinterId = `splinter-${i}`;
      
      const claimToken = jwt.sign(
        { parentTicketId, splinterId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      splinters.push({
        splinterId,
        claimToken
      });
    }

    // Zero MongoDB client exposure -> state relies on JWT validation
    return NextResponse.json({
      success: true,
      data: splinters
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
