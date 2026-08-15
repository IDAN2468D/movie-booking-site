'use server';

import clientPromise from '@/lib/mongodb';

export interface Cinema {
  _id: string;
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  region: string;
  image: string;
  feature: string;
  lat: number;
  lng: number;
  phone: string;
  rating: number;
  facilities: string[];
  hours: string;
  halls: {
    name: string;
    capacity: number;
    type: string;
  }[];
}

const FALLBACK_CINEMAS: Cinema[] = [
  {
    _id: "c1",
    id: "c1",
    name: "CinePulse תל אביב - מתחם שרונה",
    location: "מרכז",
    address: "רחוב דוד אלעזר 12, מתחם שרונה",
    city: "תל אביב",
    region: "מרכז",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    feature: "אולם IMAX לייזר וסאונד מרחבי 3D",
    lat: 32.0718,
    lng: 34.7869,
    phone: "03-5551234",
    rating: 4.9,
    facilities: ["IMAX 3D", "מושבי VIP", "Dolby Atmos", "בר קוקטיילים", "חניה מקורה"],
    hours: "10:00 - 02:00",
    halls: [
      { name: "אולם 1 - IMAX Prime", capacity: 280, type: "IMAX 3D" },
      { name: "אולם 2 - Dolby Cinema", capacity: 160, type: "Dolby Atmos" },
      { name: "אולם 3 - VIP Lounge", capacity: 48, type: "VIP Recliner" }
    ]
  },
  {
    _id: "c2",
    id: "c2",
    name: "CinePulse ירושלים - מתחם התחנה",
    location: "ירושלים",
    address: "רחוב דוד רמז 4, מתחם התחנה הראשונה",
    city: "ירושלים",
    region: "ירושלים",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800",
    feature: "אולם 4DX עם תנועה ורוח ואפקטים חושיים",
    lat: 31.7683,
    lng: 35.2255,
    phone: "02-6661234",
    rating: 4.8,
    facilities: ["4DX", "Dolby Atmos", "קפה בוטיק", "נגישות מלאה"],
    hours: "11:00 - 01:00",
    halls: [
      { name: "אולם 1 - 4DX Sensory", capacity: 120, type: "4DX" },
      { name: "אולם 2 - Premiere Hall", capacity: 200, type: "Laser 4K" }
    ]
  },
  {
    _id: "c3",
    id: "c3",
    name: "CinePulse חיפה - גרנד קניון",
    location: "צפון",
    address: "דרך שמחה גולן 54, גרנד קניון",
    city: "חיפה",
    region: "צפון",
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&q=80&w=800",
    feature: "ScreenX 270 מעלות וסאב-באס 35Hz",
    lat: 32.7891,
    lng: 35.0068,
    phone: "04-8881234",
    rating: 4.85,
    facilities: ["ScreenX", "VIP Lounge", "מזנון גורמה", "חניה חינם"],
    hours: "10:30 - 01:30",
    halls: [
      { name: "אולם 1 - ScreenX Panoramic", capacity: 220, type: "ScreenX" },
      { name: "אולם 2 - Master VIP", capacity: 56, type: "VIP Recliner" }
    ]
  },
  {
    _id: "c4",
    id: "c4",
    name: "CinePulse ראשון לציון - מתחם האגם",
    location: "מרכז",
    address: "רחוב המאה ועשרים 4, מתחם האגם",
    city: "ראשון לציון",
    region: "מרכז",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
    feature: "מתחם VIP ענק ואולמות ScreenX",
    lat: 31.9730,
    lng: 34.7640,
    phone: "03-9991234",
    rating: 4.9,
    facilities: ["VIP Exclusive", "IMAX Laser", "מסעדת שף", "נוף לאגם"],
    hours: "10:00 - 02:30",
    halls: [
      { name: "אולם 1 - Grand IMAX", capacity: 340, type: "IMAX Laser" },
      { name: "אולם 2 - VIP Gold", capacity: 64, type: "VIP Recliner" }
    ]
  },
  {
    _id: "c5",
    id: "c5",
    name: "CinePulse באר שבע - גרנד קניון",
    location: "דרום",
    address: "שדרות טוביהו 125, גרנד קניון",
    city: "באר שבע",
    region: "דרום",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800",
    feature: "אולם IMAX לייזר ומתחם VIP מפואר",
    lat: 31.2529,
    lng: 34.7915,
    phone: "08-7771234",
    rating: 4.88,
    facilities: ["IMAX 3D", "VIP Lounge", "Dolby Atmos", "חניה חינם"],
    hours: "10:30 - 02:00",
    halls: [
      { name: "אולם 1 - South IMAX", capacity: 300, type: "IMAX Laser" },
      { name: "אולם 2 - Desert VIP", capacity: 52, type: "VIP Recliner" }
    ]
  }
];

export async function getCinemas(): Promise<{ success: boolean; data: Cinema[] }> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Mongo timeout')), 1200)
    );

    const fetchDbCinemas = async () => {
      const client = await clientPromise;
      const db = client.db('movie-booking');
      const cinemas = await db.collection('cinemas').find({}).toArray();
      return cinemas;
    };

    const cinemas = await Promise.race([fetchDbCinemas(), timeoutPromise]);

    if (Array.isArray(cinemas) && cinemas.length > 0) {
      const DEFAULT_CINEMA_IMAGE = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800";
      const formattedCinemas = JSON.parse(JSON.stringify(cinemas)).map((c: Omit<Cinema, 'id'> & { _id?: string }) => {
        const hasImage = c.image && typeof c.image === 'string' && c.image.trim() !== "" && c.image !== "undefined";
        return {
          ...c,
          id: c._id?.toString() || "",
          image: hasImage ? c.image : DEFAULT_CINEMA_IMAGE
        };
      }) as Cinema[];

      return { success: true, data: formattedCinemas };
    }

    return { success: true, data: FALLBACK_CINEMAS };
  } catch {
    return { success: true, data: FALLBACK_CINEMAS };
  }
}
