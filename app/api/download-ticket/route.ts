import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Helper to handle Hebrew text in PDFKit
const fixHebrew = (text: string) => {
  if (!text) return '';
  // PDFKit doesn't handle RTL. We need to reverse Hebrew words but keep non-Hebrew ones.
  // This smarter version splits by words/numbers.
  return text.split(/(\s+)/).map(part => {
    const hasHebrew = /[\u0590-\u05FF]/.test(part);
    if (hasHebrew) {
      return part.split('').reverse().join('');
    }
    return part;
  }).join('');
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
          size: 'A5',
          font: hasFont ? fontPath : undefined
        });

        const chunks: Uint8Array[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        if (hasFont) doc.registerFont('Hebrew', fontPath);

        const width = doc.page.width;
        const height = doc.page.height;

        // Background
        doc.rect(0, 0, width, height).fill('#0A0A0A');
        doc.rect(0, 0, width, 150).fill('rgba(255, 159, 10, 0.05)');

        // Poster Image
        if (imageBuffer) {
          const imgWidth = 140;
          const imgHeight = 210;
          const imgX = (width - imgWidth) / 2;
          doc.image(imageBuffer, imgX, 40, { width: imgWidth, height: imgHeight });
          doc.rect(imgX, 40, imgWidth, imgHeight).lineWidth(1).stroke('rgba(255, 255, 255, 0.1)');
        }

        // Header
        doc.fillColor('#FF9F0A').fontSize(10).font(hasFont ? 'Hebrew' : 'Helvetica').text('MOVIEBOOK DIGITAL TICKET', 0, 20, { align: 'center', characterSpacing: 2 });

        // Movie Title
        const titleY = 270;
        doc.fillColor('#FFFFFF').fontSize(24).text(fixHebrew(movieTitle), 30, titleY, { align: 'center', width: width - 60 });

        // Separator
        doc.moveTo(40, titleY + 45).lineTo(width - 40, titleY + 45).lineWidth(0.5).stroke('rgba(255, 255, 255, 0.1)');

        // Grid
        const gridY = titleY + 65;
        const col1 = width - 150;
        const col2 = width - 40;

        const drawLabelValue = (label: string, value: string, y: number) => {
          doc.fillColor('rgba(255, 255, 255, 0.4)').fontSize(9).text(fixHebrew(label), col1, y, { align: 'right', width: col2 - col1 });
          doc.fillColor('#FFFFFF').fontSize(12).text(fixHebrew(value), col1, y + 12, { align: 'right', width: col2 - col1 });
        };

        drawLabelValue('שם המזמין', userName || 'אורח', gridY);
        drawLabelValue('תאריך', date, gridY + 45);
        drawLabelValue('שעה', time, gridY + 90);

        const col3 = 40;
        const col4 = 150;
        const drawLabelValueLeft = (label: string, value: string, y: number) => {
          doc.fillColor('rgba(255, 255, 255, 0.4)').fontSize(9).text(fixHebrew(label), col3, y, { align: 'left', width: col4 - col3 });
          doc.fillColor('#FFFFFF').fontSize(12).text(fixHebrew(value), col3, y + 12, { align: 'left', width: col4 - col3 });
        };

        drawLabelValueLeft('אולם', hall, gridY);
        drawLabelValueLeft('מושבים', Array.isArray(seats) ? seats.join(', ') : seats, gridY + 45);
        drawLabelValueLeft('סה"כ לתשלום', `${price} ₪`, gridY + 90);

        // Stub
        doc.moveTo(0, height - 60).lineTo(width, height - 60).dash(5, { space: 5 }).lineWidth(1).stroke('rgba(255, 159, 10, 0.3)');
        doc.undash();

        // Footer
        doc.fillColor('rgba(255, 255, 255, 0.2)').fontSize(8).text(`ORDER ID: ${orderId}`, 0, height - 40, { align: 'center' });
        doc.fillColor('#FF9F0A').fontSize(10).text(fixHebrew('תודה שבחרת ב-MovieBook!'), 0, height - 25, { align: 'center' });

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
