export interface ScreensaverMovieData {
  id: number;
  title: string;
  description: string;
  year: string;
  genres: string[];
  backdropUrl: string;
  posterUrl: string;
}

export const SCREEN_SAVER_MOVIES: ScreensaverMovieData[] = [
  {
    id: 1,
    title: 'חולית: חלק שני',
    description: 'פול אטריאידס מתאחד עם צ\'אני והדררים בנתיב של נקמה נגד הקושרים שהשמידו את משפחתו.',
    year: '2024',
    genres: ['מדע בדיוני', 'הרפתקאות', 'פעולה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    id: 2,
    title: 'אופנהיימר',
    description: 'סיפורו של המדען האמריקאי ג\'יי רוברט אופנהיימר, ותפקידו המכריע בפיתוח פצצת האטום.',
    year: '2023',
    genres: ['ביוגרפיה', 'דרמה', 'היסטוריה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  },
  {
    id: 3,
    title: 'בלייד ראנר 2049',
    description: 'חשיפת סוד קבור על ידי בלייד ראנר צעיר מובילה אותו למסע חיפוש אחר ריק דקארד שנעדר 30 שנה.',
    year: '2017',
    genres: ['מדע בדיוני', 'מסתורין', 'פעולה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
  },
  {
    id: 4,
    title: 'בין כוכבים',
    description: 'צוות חוקרים נוסע דרך חור תולעת בחלל בניסיון להבטיח את הישרדותה של האנושות ולמצוא כוכב חדש.',
    year: '2014',
    genres: ['מדע בדיוני', 'הרפתקאות', 'דרמה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
  },
  {
    id: 5,
    title: 'אווטאר: דרכם של המים',
    description: 'ג\'ייק סאלי ונייטירי מקימים משפחה ועושים הכל כדי להישאר יחד, עד שאיום ישן חוזר לממש את משימתו.',
    year: '2022',
    genres: ['מדע בדיוני', 'הרפתקאות', 'פנטזיה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/kJsPVzdyBrYHLomuNv5SJDXUQ2f.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
  },
  {
    id: 6,
    title: 'התחלה (Inception)',
    description: 'גנב המשתמש בטכנולוגיית שיתוף חלומות כדי לגנוב סודות תאגידיים מקבל משימה הפוכה: להשתיל רעיון.',
    year: '2010',
    genres: ['מדע בדיוני', 'פעולה', 'מתח'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
  },
  {
    id: 7,
    title: 'ספיידרמן: מעבר לממדי העכביש',
    description: 'מיילס מוראלס משגר את עצמו מחדש דרך המולטיוורס, שם הוא פוגש צוות של אנשי עכביש המגנים על קיומו.',
    year: '2023',
    genres: ['אנימציה', 'פעולה', 'הרפתקאות'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/9xfDWXAUbFXQK585JvByT5pEAhe.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  },
  {
    id: 8,
    title: 'האביר האפל',
    description: 'כאשר האיום הידוע כג\'וקר מזרים הרס וכאוס על גות\'אם, באטמן חייב לקבל את המבחנים הפסיכולוגיים והפיזיים הגדולים ביותר.',
    year: '2008',
    genres: ['פעולה', 'פשע', 'דרמה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    id: 9,
    title: 'טרון: המורשת',
    description: 'בנו של מעצב משחקים מבריק מחפש את אביו שנעלם ונלכד בעולם הדיגיטלי שהוא בעצמו יצר.',
    year: '2010',
    genres: ['מדע בדיוני', 'פעולה', 'הרפתקאות'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/uUa6jgSr5BQpcBhhaz1PV1JhSa4.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Nc6R8k7bG8frSiDJo0oLucF7dN.jpg',
  },
  {
    id: 10,
    title: 'לה לה לנד',
    description: 'שחקנית מתחילה ופסנתרן ג\'אז נלהב מתאהבים בזמן שניהם רודפים אחר חלומותיהם בלוס אנג\'לס.',
    year: '2016',
    genres: ['רומנטיקה', 'דרמה', 'מוזיקה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
  },
];
