import { Friend, Seat, FriendSatisfaction, MovieOption } from '@/types/seatingGame';

export const FEATURED_MOVIES: MovieOption[] = [
  {
    id: 'm1',
    title: 'Gladiator II',
    hebrewTitle: 'גלדיאטור 2',
    poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    genre: 'אקשן / דרמה',
    duration: '148 דקות',
    pricePerTicket: 48,
    showtimes: ['19:30', '21:45', '22:30'],
  },
  {
    id: 'm2',
    title: 'Dune: Part Two',
    hebrewTitle: 'דיונה: חלק 2',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    genre: 'מדע בדיוני / הרפתקאות',
    duration: '166 דקות',
    pricePerTicket: 52,
    showtimes: ['18:00', '20:15', '21:30'],
  },
  {
    id: 'm3',
    title: 'Avatar: Fire and Ash',
    hebrewTitle: 'אווטאר: אש ואפר',
    poster: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
    genre: 'מדע בדיוני / 3D IMAX',
    duration: '190 דקות',
    pricePerTicket: 55,
    showtimes: ['17:30', '19:00', '21:00'],
  },
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'עומר',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    color: '#3B82F6',
    preference: 'center',
    preferenceText: 'רוצה לשבת במרכז המסך',
  },
  {
    id: 'f2',
    name: 'מיה',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    color: '#EC4899',
    preference: 'aisle',
    preferenceText: 'מעדיפה מושב מעבר ליציאה מהירה',
  },
  {
    id: 'f3',
    name: 'דניאל',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    color: '#10B981',
    preference: 'back_row',
    preferenceText: 'אוהב לשבת בשורה האחורית למעלה',
  },
  {
    id: 'f4',
    name: 'נועה',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    color: '#F59E0B',
    preference: 'avoid_front',
    preferenceText: 'רוצה להימנע לחלוטין מהשורה הראשונה',
  },
  {
    id: 'f5',
    name: 'ליאם',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    color: '#8B5CF6',
    preference: 'next_to',
    preferenceText: 'חייב לשבת ליד מיה',
    targetFriendId: 'f2',
  },
];

export const INITIAL_SEATS: Seat[] = (() => {
  const rows = ['A', 'B', 'C', 'D'];
  const seats: Seat[] = [];
  rows.forEach((row) => {
    for (let col = 1; col <= 8; col++) {
      seats.push({
        id: `${row}-${col}`,
        row,
        col,
        isVip: row === 'C' || row === 'D',
        isAisle: col === 1 || col === 8,
        isFrontRow: row === 'A',
        isCenter: (col === 4 || col === 5) && (row === 'B' || row === 'C'),
      });
    }
  });
  return seats;
})();

export function areSeatsAdjacent(seatA: Seat, seatB: Seat): boolean {
  if (seatA.row === seatB.row && Math.abs(seatA.col - seatB.col) === 1) return true;
  const rowOrder = ['A', 'B', 'C', 'D'];
  const rA = rowOrder.indexOf(seatA.row);
  const rB = rowOrder.indexOf(seatB.row);
  if (seatA.col === seatB.col && Math.abs(rA - rB) === 1) return true;
  return false;
}

export function evaluateFriendSatisfaction(
  friend: Friend,
  seat: Seat,
  assignedSeats: Record<string, string>,
  allSeats: Seat[]
): FriendSatisfaction {
  let score = 0;
  let reasonText = '';

  switch (friend.preference) {
    case 'center':
      if (seat.isCenter) { score = 100; reasonText = 'מושב מרכזי מושלם!'; }
      else if (seat.col === 3 || seat.col === 6) { score = 60; reasonText = 'קרוב למרכז'; }
      else { score = 20; reasonText = 'רחוק ממרכז המסך'; }
      break;

    case 'aisle':
      if (seat.isAisle) { score = 100; reasonText = 'מושב מעבר מעולה'; }
      else if (seat.col === 2 || seat.col === 7) { score = 50; reasonText = 'כמעט על המעבר'; }
      else { score = 10; reasonText = 'רחוק מהמעבר'; }
      break;

    case 'back_row':
      if (seat.row === 'D') { score = 100; reasonText = 'שורה אחורית ביותר!'; }
      else if (seat.row === 'C') { score = 70; reasonText = 'שורה גבוהה'; }
      else if (seat.row === 'B') { score = 30; reasonText = 'שורה נמוכה יחסית'; }
      else { score = 0; reasonText = 'שורה ראשונה'; }
      break;

    case 'avoid_front':
      if (!seat.isFrontRow) { score = 100; reasonText = 'רחוק מהשורה הראשונה'; }
      else { score = 0; reasonText = 'בשורה הראשונה - סנוורים!'; }
      break;

    case 'next_to':
      if (friend.targetFriendId) {
        const targetEntry = Object.entries(assignedSeats).find(([, fId]) => fId === friend.targetFriendId);
        if (!targetEntry) { score = 40; reasonText = 'החבר/ה המבוקש/ת טרם שובצ/ה'; }
        else {
          const targetSeat = allSeats.find((s) => s.id === targetEntry[0]);
          if (targetSeat && areSeatsAdjacent(seat, targetSeat)) { score = 100; reasonText = 'יושב/ת צמוד לחבר/ה!'; }
          else if (targetSeat && seat.row === targetSeat.row) { score = 50; reasonText = 'באותה שורה, אך לא צמוד'; }
          else { score = 10; reasonText = 'רחוק מהחבר/ה המבוקש/ת'; }
        }
      }
      break;
  }

  return { friendId: friend.id, score, fulfilled: score >= 70, reasonText };
}

export function calculateGroupHarmony(
  assignedSeats: Record<string, string>,
  allSeats: Seat[],
  friends: Friend[]
): { totalScore: number; satisfactions: Record<string, FriendSatisfaction>; textStatus: string } {
  if (Object.keys(assignedSeats).length === 0) {
    return { totalScore: 0, satisfactions: {}, textStatus: 'טרם שובצו חברים' };
  }

  const satisfactions: Record<string, FriendSatisfaction> = {};
  let sumScore = 0;
  let count = 0;

  friends.forEach((friend) => {
    const seatId = Object.keys(assignedSeats).find((sId) => assignedSeats[sId] === friend.id);
    if (seatId) {
      const seat = allSeats.find((s) => s.id === seatId);
      if (seat) {
        const sat = evaluateFriendSatisfaction(friend, seat, assignedSeats, allSeats);
        satisfactions[friend.id] = sat;
        sumScore += sat.score;
        count++;
      }
    }
  });

  const totalScore = count > 0 ? Math.round(sumScore / friends.length) : 0;
  let textStatus = 'צריך שיפור';
  if (totalScore >= 90) textStatus = 'הרמוניה מושלמת! ✨';
  else if (totalScore >= 75) textStatus = 'הרמוניה מעולה! 🌟';
  else if (totalScore >= 50) textStatus = 'הרמוניה סבירה 👍';

  return { totalScore, satisfactions, textStatus };
}

export function findOptimalSeating(seats: Seat[], friends: Friend[]): Record<string, string> {
  const result: Record<string, string> = {};
  const centerFriend = friends.find((f) => f.preference === 'center');
  const aisleFriend = friends.find((f) => f.preference === 'aisle');
  const backFriend = friends.find((f) => f.preference === 'back_row');
  const avoidFrontFriend = friends.find((f) => f.preference === 'avoid_front');
  const nextToFriend = friends.find((f) => f.preference === 'next_to');

  if (aisleFriend) result['C-1'] = aisleFriend.id;
  if (centerFriend) result['C-4'] = centerFriend.id;
  if (nextToFriend) result['C-5'] = nextToFriend.id;
  if (backFriend) result['D-8'] = backFriend.id;
  if (avoidFrontFriend) result['B-2'] = avoidFrontFriend.id;
  return result;
}
