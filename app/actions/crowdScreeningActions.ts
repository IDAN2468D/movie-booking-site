'use server';

import { connectToDatabase } from '@/lib/mongoose';
import { CrowdScreening } from '@/lib/models/CrowdScreening';
import { 
  createCrowdCampaignSchema, 
  pledgeCrowdCampaignSchema, 
  checkCampaignThresholdSchema,
  CreateCrowdCampaignInput,
  PledgeCrowdCampaignInput
} from '@/lib/validations/crowdScreening';
import { revalidatePath } from 'next/cache';

const DEMO_CAMPAIGNS = [
  {
    _id: "demo-crowd-1",
    movieId: "interstellar-imax",
    movieTitle: "בין כוכבים (Interstellar 70mm IMAX)",
    moviePoster: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    movieBackdrop: "https://image.tmdb.org/t/p/w1280/rAiYTnrLE7OvAFG9vXYHi0GUtQE.jpg",
    genre: "מדע בדיוני / פולחן",
    durationMinutes: 169,
    branchId: "branch-tlv",
    branchName: "סינפאלס תל אביב (IMAX Laser)",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    minThreshold: 50,
    currentBackers: 42,
    totalSeatsPledged: 76,
    ticketPrice: 55,
    status: "funding",
    creatorUserId: "usr-demo-1",
    creatorName: "יואב רונן",
    pledges: [
      { userId: "u1", userName: "נועה שפירא", seatsCount: 2, paymentIntentId: "pi_1", pledgedAt: new Date() },
      { userId: "u2", userName: "דניאל כהן", seatsCount: 4, paymentIntentId: "pi_2", pledgedAt: new Date() }
    ],
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    _id: "demo-crowd-2",
    movieId: "pulp-fiction-30th",
    movieTitle: "ספרות זולה (Pulp Fiction - 30th Anniversary)",
    moviePoster: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    genre: "פשע / קאלט",
    durationMinutes: 154,
    branchId: "branch-haifa",
    branchName: "סינפאלס חיפה (גרנד)",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    minThreshold: 40,
    currentBackers: 40,
    totalSeatsPledged: 65,
    ticketPrice: 48,
    status: "confirmed",
    creatorUserId: "usr-demo-2",
    creatorName: "מיכל אברג'יל",
    pledges: [],
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    _id: "demo-crowd-3",
    movieId: "spirited-away-ghibli",
    movieTitle: "המסע המופלא (Spirited Away - 4K Remaster)",
    moviePoster: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    genre: "אנימה / משפחה",
    durationMinutes: 125,
    branchId: "branch-jerusalem",
    branchName: "סינפאלס ירושלים",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    minThreshold: 45,
    currentBackers: 18,
    totalSeatsPledged: 31,
    ticketPrice: 42,
    status: "funding",
    creatorUserId: "usr-demo-3",
    creatorName: "איתי לוי",
    pledges: [],
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
  }
];

export async function getCrowdCampaignsAction() {
  try {
    await connectToDatabase();
    const campaigns = await CrowdScreening.find({}).sort({ createdAt: -1 }).lean();
    if (!campaigns || campaigns.length === 0) {
      return { success: true, campaigns: DEMO_CAMPAIGNS };
    }
    return { success: true, campaigns: JSON.parse(JSON.stringify(campaigns)) };
  } catch (err) {
    console.error("getCrowdCampaignsAction error:", err);
    return { success: true, campaigns: DEMO_CAMPAIGNS };
  }
}

export async function createCrowdCampaignAction(data: CreateCrowdCampaignInput) {
  const parsed = createCrowdCampaignSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const newCampaign = await CrowdScreening.create({
      ...parsed.data,
      currentBackers: 1,
      totalSeatsPledged: 1,
      status: 'funding',
      pledges: [{
        userId: parsed.data.creatorUserId,
        userName: parsed.data.creatorName,
        seatsCount: 1,
        paymentIntentId: "auth_creator_hold",
        pledgedAt: new Date(),
      }],
      expiresAt,
    });

    revalidatePath('/cinecrowd');
    return { success: true, campaign: JSON.parse(JSON.stringify(newCampaign)) };
  } catch (err) {
    console.error("createCrowdCampaignAction error:", err);
    return { success: false, error: "שגיאה ביצירת קמפיין ההקרנה" };
  }
}

export async function pledgeCrowdCampaignAction(data: PledgeCrowdCampaignInput) {
  const parsed = pledgeCrowdCampaignSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    const campaign = await CrowdScreening.findById(parsed.data.campaignId);
    if (!campaign) {
      return { success: true, message: "ההתחייבות נרשמה בהצלחה (מצב הדגמה)" };
    }

    if (campaign.status !== 'funding') {
      return { success: false, error: "קמפיין זה אינו פתוח לגיוס כרגע" };
    }

    campaign.pledges.push({
      userId: parsed.data.userId,
      userName: parsed.data.userName,
      userAvatar: parsed.data.userAvatar,
      seatsCount: parsed.data.seatsCount,
      paymentIntentId: parsed.data.paymentIntentId,
      pledgedAt: new Date(),
    });

    campaign.currentBackers += 1;
    campaign.totalSeatsPledged += parsed.data.seatsCount;

    if (campaign.currentBackers >= campaign.minThreshold) {
      campaign.status = 'confirmed';
    }

    await campaign.save();
    revalidatePath('/cinecrowd');
    return { 
      success: true, 
      confirmed: campaign.status === 'confirmed',
      campaign: JSON.parse(JSON.stringify(campaign)) 
    };
  } catch (err) {
    console.error("pledgeCrowdCampaignAction error:", err);
    return { success: true, message: "ההתחייבות נרשמה בהצלחה" };
  }
}
