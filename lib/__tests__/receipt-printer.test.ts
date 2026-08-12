import { describe, it, expect } from 'vitest';
import { CineBookReceiptData } from '@/components/receipt/CineBookReceiptPrinter';

describe('CineBookReceiptPrinter', () => {
  it('calculates total correctly for receipt data', () => {
    const data: CineBookReceiptData = {
      cinemaName: 'CINEPULSE VIP CINEMA',
      tagline: 'אישור הזמנה וכרטיס קולנוע דיגיטלי',
      movieTitle: 'אווטאר 3',
      formatAndHall: 'אולם 1 | IMAX 3D',
      showtime: '20:30',
      selectedSeats: ['שורה 5 - מושב 10'],
      bookingCode: 'CNB-12345678',
      items: [
        { name: '1X כרטיס קולנוע IMAX 3D', qty: 1, price: 55 },
        { name: '1X פופקורן ענק', qty: 1, price: 35 },
      ],
      subtotal: 90,
      taxAmount: 0,
      total: 90,
    };

    expect(data.total).toBe(90);
    expect(data.items.length).toBe(2);
    expect(data.bookingCode).toContain('CNB-');
    expect(data.selectedSeats[0]).toBe('שורה 5 - מושב 10');
  });
});
