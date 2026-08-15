export interface TicketType {
  id: string;
  movie: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  image: string;
  active: boolean;
  points?: number;
  total?: number;
}

export const FALLBACK_VIP_TICKETS: TicketType[] = [
  {
    id: 'CP-VIP-8891',
    movie: 'גלדיאטור 2 - גרסת ה-VIP',
    date: '15/08/2026',
    time: '20:30',
    hall: 'אולם VIP 01 - Dolby Atmos',
    seats: ['A-12', 'A-13'],
    image: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    active: true,
    points: 150,
    total: 90
  },
  {
    id: 'CP-VIP-9942',
    movie: 'דיונה: חלק שני - IMAX 3D',
    date: '20/08/2026',
    time: '21:00',
    hall: 'אולם IMAX Spatial 02',
    seats: ['F-05', 'F-06', 'F-07'],
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    active: true,
    points: 220,
    total: 135
  },
  {
    id: 'CP-VIP-1052',
    movie: 'אווטאר: אש ואפר',
    date: '28/08/2026',
    time: '19:45',
    hall: 'אולם 3D Haptic 05',
    seats: ['C-08'],
    image: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
    active: true,
    points: 90,
    total: 45
  }
];
