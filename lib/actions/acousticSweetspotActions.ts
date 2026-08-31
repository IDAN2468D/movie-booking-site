"use server";

import {
  HallAcousticQuerySchema,
  HallAcousticData,
  SeatAcousticProfile,
  SweetSpotRating,
} from "@/lib/schemas/acousticSweetspot.schema";

const ROWS = ["A", "B", "C", "D", "E", "F"];
const SEATS_PER_ROW = 8;

function calculateSeatProfile(rowIdx: number, seatNum: number, rowLetter: string): SeatAcousticProfile {
  // Normalize coordinates: x (-1 left to 1 right), y (0 front to 1 back)
  const normX = ((seatNum - 1) / (SEATS_PER_ROW - 1)) * 2 - 1;
  const normY = rowIdx / (ROWS.length - 1);
  const seatId = `${rowLetter}${seatNum}`;

  // Speaker Distances in arbitrary hall meters (hall size ~ 18m x 14m)
  const frontLeft = Math.hypot(normX - (-1.0), normY - 0.0) * 10 + 3;
  const frontCenter = Math.hypot(normX - 0.0, normY - 0.0) * 10 + 2.5;
  const frontRight = Math.hypot(normX - 1.0, normY - 0.0) * 10 + 3;
  const surroundLeft = Math.hypot(normX - (-1.0), normY - 0.6) * 6 + 2;
  const surroundRight = Math.hypot(normX - 1.0, normY - 0.6) * 6 + 2;
  const subwoofer = Math.hypot(normX - 0.0, normY - 0.1) * 8 + 2;

  // Center rows (C, D) and center seats (3, 4, 5, 6) give maximum balance
  const centerDistance = Math.hypot(normX * 1.2, (normY - 0.55) * 1.5);
  const immersionScore = Math.max(40, Math.min(99, Math.round(99 - centerDistance * 45)));

  let sweetSpotRating: SweetSpotRating = "GOOD";
  let recommendedPerk = "חוויית שמע היקפית טובה";

  if (immersionScore >= 92) {
    sweetSpotRating = "EXCELLENT";
    recommendedPerk = "נקודת הזהב האקוסטית - איזון מושלם 360° Dolby Atmos";
  } else if (immersionScore >= 80) {
    sweetSpotRating = "OPTIMAL";
    recommendedPerk = "שמע היקפי מצוין ובהירות דיאלוגים מוגברת";
  } else if (Math.abs(normX) > 0.6) {
    sweetSpotRating = "SIDE_LEANING";
    recommendedPerk = "הדגשת ערוץ צד - חוויית סטריאו דומיננטית";
  }

  const reverbTimeSec = Number((0.45 + normY * 0.25).toFixed(2));
  const bassClarityIndex = Math.round(100 - Math.abs(normY - 0.4) * 35);
  const dialogueIntelligibility = Math.round(100 - centerDistance * 30);

  return {
    seatId,
    row: rowLetter,
    number: seatNum,
    coordinates: { x: Number(normX.toFixed(2)), y: Number(normY.toFixed(2)), z: 0 },
    speakerDistances: {
      frontLeft: Number(frontLeft.toFixed(1)),
      frontCenter: Number(frontCenter.toFixed(1)),
      frontRight: Number(frontRight.toFixed(1)),
      surroundLeft: Number(surroundLeft.toFixed(1)),
      surroundRight: Number(surroundRight.toFixed(1)),
      subwoofer: Number(subwoofer.toFixed(1)),
    },
    immersionScore,
    sweetSpotRating,
    reverbTimeSec,
    bassClarityIndex,
    dialogueIntelligibility,
    recommendedPerk,
  };
}

export async function fetchHallAcousticProfile(
  input?: unknown
): Promise<{ success: boolean; data?: HallAcousticData; error?: string }> {
  try {
    const parsed = HallAcousticQuerySchema.safeParse(input || {});
    if (!parsed.success) {
      return { success: false, error: "נתוני שאילתת אקוסטיקה שגויים" };
    }

    const profiles: Record<string, SeatAcousticProfile> = {};
    let optimalSeatId = "D4";
    let highestScore = 0;

    ROWS.forEach((rowLetter, rowIdx) => {
      for (let seatNum = 1; seatNum <= SEATS_PER_ROW; seatNum++) {
        const profile = calculateSeatProfile(rowIdx, seatNum, rowLetter);
        profiles[profile.seatId] = profile;
        if (profile.immersionScore > highestScore) {
          highestScore = profile.immersionScore;
          optimalSeatId = profile.seatId;
        }
      }
    });

    return {
      success: true,
      data: {
        hallName: "אולם אקוסטי ראשי 1 - Dolby Atmos 64 Ch",
        soundSystem: "Dolby Atmos Wavefront Spatial Array + 35Hz Sub-Bass",
        totalSeats: ROWS.length * SEATS_PER_ROW,
        optimalSeatId,
        profiles,
      },
    };
  } catch {
    return { success: false, error: "שגיאה בחישוב פרופיל אקוסטי של האולם" };
  }
}
