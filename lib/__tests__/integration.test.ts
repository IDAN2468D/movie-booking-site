import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as redeemReward } from '@/app/api/rewards/redeem/route';
import { getServerSession } from 'next-auth';

// Use vi.hoisted to define variables used in vi.mock
const { mockDbMethods, mockClientInstance } = vi.hoisted(() => {
  const dbMethods = {
    collection: vi.fn().mockReturnThis(),
    findOne: vi.fn(),
    updateOne: vi.fn(),
    insertOne: vi.fn(),
  };
  const clientInstance = {
    connect: vi.fn().mockImplementation(async function (this: any) { return this; }),
    db: vi.fn().mockReturnValue(dbMethods),
    close: vi.fn(),
  };
  return { mockDbMethods: dbMethods, mockClientInstance: clientInstance };
});

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock mongodb using a class
vi.mock('mongodb', () => {
  return {
    MongoClient: class {
      connect = mockClientInstance.connect;
      db = mockClientInstance.db;
      close = mockClientInstance.close;
    },
    ObjectId: vi.fn(),
  };
});

describe('Rewards API Integration', () => {
  const mockSession = {
    user: { id: 'user123', email: 'test@example.com' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
  });

  it('should return 401 if not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = new Request('http://localhost/api/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId: 1, points: 500 }),
    });
    const response = await redeemReward(req);
    expect(response.status).toBe(401);
  });

  it('should prevent redemption if points are insufficient', async () => {
    mockDbMethods.findOne.mockResolvedValue({ points: 100 });

    const req = new Request('http://localhost/api/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId: 1, points: 500 }),
    });

    const response = await redeemReward(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Insufficient points');
  });

  it('should successfully redeem a reward and deduct points', async () => {
    mockDbMethods.findOne.mockResolvedValue({ points: 1000, _id: 'user_obj_id' });
    mockDbMethods.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mockDbMethods.insertOne.mockResolvedValue({ insertedId: 'redemption123' });

    const req = new Request('http://localhost/api/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId: 1, points: 500 }),
    });

    const response = await redeemReward(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.code).toMatch(/^RW-/);
    expect(mockDbMethods.updateOne).toHaveBeenCalled();
  });
});
