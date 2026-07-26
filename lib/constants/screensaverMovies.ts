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
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2JGjjc9CW.jpg'),
  },
  {
    id: 2,
    title: 'אופנהיימר',
    description: 'סיפורו של המדען האמריקאי ג\'יי רוברט אופנהיימר, ותפקידו המכריע בפיתוח פצצת האטום.',
    year: '2023',
    genres: ['ביוגרפיה', 'דרמה', 'היסטוריה'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
  },
  {
    id: 3,
    title: 'בלייד ראנר 2049',
    description: 'חשיפת סוד קבור על ידי בלייד ראנר צעיר מובילה אותו למסע חיפוש אחר ריק דקארד שנעדר 30 שנה.',
    year: '2017',
    genres: ['מדע בדיוני', 'מסתורין', 'פעולה'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/ilRyazdUWJlVybfqD0A3HlA9bC4.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'),
  },
  {
    id: 4,
    title: 'בין כוכבים',
    description: 'צוות חוקרים נוסע דרך חור תולעת בחלל בניסיון להבטיח את הישרדותה של האנושות ולמצוא כוכב חדש.',
    year: '2014',
    genres: ['מדע בדיוני', 'הרפתקאות', 'דרמה'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
  },
  {
    id: 5,
    title: 'אווטאר: דרכם של המים',
    description: 'ג\'ייק סאלי ונייטירי מקימים משפחה ועושים הכל כדי להישאר יחד, עד שאיום ישן חוזר לממש את משימתו.',
    year: '2022',
    genres: ['מדע בדיוני', 'הרפתקאות', 'פנטזיה'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/vL5LR6WdxWPjUnFRVPW3Y5U40W.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/t6HIrqfC21L12GhyN5tX2W8h88.jpg'),
  },
  {
    id: 6,
    title: 'התחלה (Inception)',
    description: 'גנב המשתמש בטכנולוגיית שיתוף חלומות כדי לגנוב סודות תאגידיים מקבל משימה הפוכה: להשתיל רעיון.',
    year: '2010',
    genres: ['מדע בדיוני', 'פעולה', 'מתח'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/8ZtN2B9ZgV229gH8vG7B298379Z.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/oYuLE29W9BmUhLFfQ9uhGDGIjE.jpg'),
  },
  {
    id: 7,
    title: 'ספיידרמן: מעבר לממדי העכביש',
    description: 'מיילס מוראלס משגר את עצמו מחדש דרך המולטיוורס, שם הוא פוגש צוות של אנשי עכביש המגנים על קיומו.',
    year: '2023',
    genres: ['אנימציה', 'פעולה', 'הרפתקאות'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/4XM8G3KHhGlQFarPDacXKGvW6vC.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'),
  },
  {
    id: 8,
    title: 'האביר האפל',
    description: 'כאשר האיום הידוע כג\'וקר מזרים הרס וכאוס על גות\'אם, באטמן חייב לקבל את המבחנים הפסיכולוגיים והפיזיים הגדולים ביותר.',
    year: '2008',
    genres: ['פעולה', 'פשע', 'דרמה'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/nMKvY3hEwB0D5e0E7N3f02E1B.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
  },
  {
    id: 9,
    title: 'טרון: המורשת',
    description: 'בנו של מעצב משחקים מבריק מחפש את אביו שנעלם ונלכד בעולם הדיגיטלי שהוא בעצמו יצר.',
    year: '2010',
    genres: ['מדע בדיוני', 'פעולה', 'הרפתקאות'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/s4hJpG7k7qW480zS27G727G.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/ko2g0H9KOmu28B452YdE2yM.jpg'),
  },
  {
    id: 10,
    title: 'לה לה לנד',
    description: 'שחקנית מתחילה ופסנתרן ג\'אז נלהב מתאהבים בזמן שניהם רודפים אחר חלומותיהם בלוס אנג\'לס.',
    year: '2016',
    genres: ['רומנטיקה', 'דרמה', 'מוזיקה'],
    backdropUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/original/dqa9ZqD0Z52W32qS57G.jpg'),
    posterUrl: '/api/proxy/image?url=' + encodeURIComponent('https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Vy0.jpg'),
  },
];
