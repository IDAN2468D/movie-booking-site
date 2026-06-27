import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // 1. Oracle Bets
    const oracleCollection = db.collection('oraclebets');
    if (await oracleCollection.countDocuments() === 0) {
      await oracleCollection.insertMany([
        {
          question: 'האם Dune: Part Three יכניס מעל מיליארד דולר בקופות?',
          description: 'הימור קופות עולמי, נסגר בעוד חודשיים.',
          status: 'active',
          options: {
            yes: { label: 'כן, מעל מיליארד', totalPool: 15000 },
            no: { label: 'לא, פחות', totalPool: 8000 }
          },
          bets: []
        },
        {
          question: 'מי יהיה הנבל הראשי בסרט הבא של ספיידרמן?',
          description: 'תחזית עלילתית, עד הכרזת הטריילר הרשמי.',
          status: 'active',
          options: {
            kraven: { label: 'קרייבן הצייד', totalPool: 5000 },
            venom: { label: 'ונום', totalPool: 25000 },
            kingpin: { label: 'קינגפין', totalPool: 12000 }
          },
          bets: []
        }
      ]);
    }

    // 2. Squad Budgets
    const squadCollection = db.collection('squadbudgets');
    if (await squadCollection.countDocuments() === 0) {
      await squadCollection.insertMany([
        {
          name: 'VIP Star Wars Premier',
          description: 'אוספים יחד לאולם פרטי כולל כיבוד להקרנת הבכורה.',
          targetAmount: 50000,
          currentAmount: 35000,
          status: 'funding',
          contributors: []
        },
        {
          name: 'יום הולדת לרוני - אולם גיימינג',
          description: 'שוכרים את מסך ה-IMAX לחווית גיימינג של 4 שעות.',
          targetAmount: 120000,
          currentAmount: 20000,
          status: 'funding',
          contributors: []
        }
      ]);
    }

    // 3. Cine Collectibles
    const collCollection = db.collection('cinecollectibles');
    if (await collCollection.countDocuments() === 0) {
      await collCollection.insertMany([
        {
          name: 'The One Ring (Digital Replica)',
          rarity: 'Legendary',
          stock: 3,
          price: 25000
        },
        {
          name: 'Lightsaber - Kyber Crystal Blue',
          rarity: 'Epic',
          stock: 50,
          price: 5000
        },
        {
          name: 'Neo\'s Sunglasses (Matrix)',
          rarity: 'Rare',
          stock: 120,
          price: 1500
        }
      ]);
    }

    return NextResponse.json({ message: 'All Liquid VIP systems seeded successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
