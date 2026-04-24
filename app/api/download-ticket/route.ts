import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Helper to handle Hebrew text in PDFKit for RTL
const fixHebrew = (text: string) => {
  if (!text) return '';
  // Split into segments of Hebrew, Numbers/Latins, and separators
  const parts = text.split(/([\u0590-\u05FF]+|[0-9/.:-]+|[a-zA-Z]+)/);
  const fixedParts = parts.map(part => {
    // Only reverse the Hebrew character sequence within the segment
    if (/[\u0590-\u05FF]/.test(part)) {
      return part.split('').reverse().join('');
    }
    return part;
  });
  // Reverse the order of all segments to simulate RTL layout in LTR PDFKit
  return fixedParts.reverse().join('');
};

export async function POST(req: Request) {
  try {
    const { movieTitle, seats, price, orderId, date, time, hall, userName, posterUrl } = await req.json();

    // 1. Fetch Poster Image
    let imageBuffer: Buffer | null = null;
    if (posterUrl) {
      try {
        const response = await fetch(posterUrl);
        if (response.ok) {
          imageBuffer = Buffer.from(await response.arrayBuffer());
        }
      } catch (e) {
        console.error('Failed to fetch poster for PDF:', e);
      }
    }

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      try {
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Assistant-Bold.ttf');
        const hasFont = fs.existsSync(fontPath);

        const doc = new PDFDocument({ 
          margin: 0, 
          size: [400, 600], // Custom ticket size
          font: hasFont ? fontPath : undefined
        });

        const chunks: Uint8Array[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        if (hasFont) doc.registerFont('Hebrew', fontPath);

        const width = doc.page.width;
        const height = doc.page.height;

        // Background: Deep Cinematic Dark
        doc.rect(0, 0, width, height).fill('#050505');
        
        // Gold Gradient Accent (Top)
        doc.rect(0, 0, width, 5).fill('#FF9F0A');
        
        // Decorative Watermark
        doc.fillColor('rgba(255, 255, 255, 0.03)').fontSize(80).font('Helvetica-Bold').text('TICKET', 20, 200, { rotation: 45 });

        // Poster Image with Glow
        if (imageBuffer) {
          const imgWidth = 160;
          const imgHeight = 240;
          const imgX = (width - imgWidth) / 2;
          doc.image(imageBuffer, imgX, 50, { width: imgWidth, height: imgHeight });
          
          // Poster Frame
          doc.rect(imgX, 50, imgWidth, imgHeight).lineWidth(2).stroke('rgba(255, 159, 10, 0.3)');
        }

        // Header Title
        doc.fillColor('#FF9F0A').fontSize(12).font(hasFont ? 'Hebrew' : 'Helvetica-Bold').text('MOVIEBOOK PREMIUM CINEMA', 0, 20, { align: 'center' });

        // Movie Title (Bold & Large)
        const titleY = 310;
        doc.fillColor('#FFFFFF').fontSize(28).text(fixHebrew(movieTitle), 30, titleY, { align: 'center', width: width - 60 });

        // Glass Separator
        doc.moveTo(50, titleY + 50).lineTo(width - 50, titleY + 50).lineWidth(1).stroke('rgba(255, 255, 255, 0.1)');

        // Details Grid
        const gridY = titleY + 75;
        const drawField = (label: string, value: string, x: number, y: number, align: 'left' | 'right') => {
          doc.fillColor('rgba(255, 255, 255, 0.5)').fontSize(10).text(fixHebrew(label), x, y, { align, width: 140 });
          doc.fillColor('#FFFFFF').fontSize(14).text(fixHebrew(value), x, y + 15, { align, width: 140 });
        };

        // Right Column (Hebrew Align Right)
        drawField('שם המזמין', userName || 'אורח', width - 170, gridY, 'right');
        drawField('תאריך', date, width - 170, gridY + 60, 'right');
        drawField('אולם', hall, width - 170, gridY + 120, 'right');

        // Left Column (Hebrew Align Left - fixed order)
        drawField('שעה', time, 30, gridY, 'left');
        drawField('מושבים', Array.isArray(seats) ? seats.join(', ') : seats, 30, gridY + 60, 'left');
        drawField('מחיר', `${price} ₪`, 30, gridY + 120, 'left');

        // Bottom Security Stub
        const stubY = height - 80;
        doc.rect(0, stubY, width, 80).fill('rgba(255, 159, 10, 0.05)');
        doc.moveTo(0, stubY).lineTo(width, stubY).dash(5, { space: 5 }).stroke('rgba(255, 255, 255, 0.2)');
        doc.undash();

        // Order ID & Thank You
        doc.fillColor('rgba(255, 255, 255, 0.3)').fontSize(9).font('Helvetica').text(`ORDER ID: ${orderId}`, 30, stubY + 25);
        doc.fillColor('#FF9F0A').fontSize(12).font(hasFont ? 'Hebrew' : 'Helvetica-Bold').text(fixHebrew('תודה שבחרת ב-MovieBook!'), width - 180, stubY + 25, { align: 'right', width: 150 });

        // Mock QR Code Area
        doc.rect(width / 2 - 15, stubY + 20, 30, 30).fill('#FFFFFF');
        doc.fillColor('#000000').fontSize(6).text('SCAN', width / 2 - 15, stubY + 32, { align: 'center', width: 30 });

        doc.end();
      } catch (e) {
        reject(e);
      }
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${orderId}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Download Error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
