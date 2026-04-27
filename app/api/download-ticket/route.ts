import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

// Helper to handle Hebrew text in PDFKit for RTL with better mixed content support
const fixHebrew = (text: string | undefined | null) => {
  if (!text) return '';
  const str = String(text);
  // Split into segments of Hebrew, and everything else
  const parts = str.split(/([\u0590-\u05FF]+)/);
  const fixedParts = parts.map(part => {
    // Only reverse the Hebrew character sequence
    if (/[\u0590-\u05FF]/.test(part)) {
      return part.split('').reverse().join('');
    }
    return part;
  });
  
  // Rejoin and reverse the entire string to put Hebrew in correct visual order
  return fixedParts.reverse().join('');
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieTitle, seats, price, orderId, date, time, hall, userName, posterUrl } = body;
    
    console.log('Starting PDF generation for Order:', orderId);

    // 1. Fetch Poster Image & QR Code
    let imageBuffer: Buffer | null = null;
    let qrBuffer: Buffer | null = null;
    
    if (posterUrl && !posterUrl.includes('null')) {
      try {
        const response = await fetch(posterUrl);
        if (response.ok) {
          imageBuffer = Buffer.from(await response.arrayBuffer());
        }
      } catch (e) {
        console.error('Poster fetch failed:', e);
      }
    }

    try {
      qrBuffer = await QRCode.toBuffer(orderId || 'N/A', {
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
        width: 150
      });
    } catch (e) {
      console.error('QR generation failed:', e);
    }

    // 2. Generate PDF using a more stable promise structure
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      try {
        const root = process.cwd();
        const fontPath = path.join(root, 'public', 'fonts', 'Assistant-Bold.ttf');
        
        if (!fs.existsSync(fontPath)) {
          throw new Error(`Font not found at ${fontPath}. Please ensure public/fonts/Assistant-Bold.ttf exists.`);
        }

        const fontBuffer = fs.readFileSync(fontPath);
        
        // Initialize document WITH the font path string (TS requires string)
        const doc = new PDFDocument({ 
          margin: 0, 
          size: [400, 600],
          font: fontPath
        });

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Register and use font explicitly
        try {
          doc.registerFont('HebrewFont', fontPath);
          doc.font('HebrewFont');
        } catch (fErr) {
          console.error('Font registration failed:', fErr);
          doc.font('Helvetica-Bold');
        }

        const width = doc.page.width;
        const height = doc.page.height;

        // Background
        doc.rect(0, 0, width, height).fill('#050505');
        doc.rect(0, 0, width, 5).fill('#FF9F0A');
        
        // Poster
        if (imageBuffer) {
          try {
            const imgWidth = 160;
            const imgHeight = 240;
            const imgX = (width - imgWidth) / 2;
            doc.image(imageBuffer, imgX, 50, { width: imgWidth, height: imgHeight });
            doc.rect(imgX, 50, imgWidth, imgHeight).lineWidth(2).stroke('rgba(255, 159, 10, 0.3)');
          } catch (imgErr) {
            console.error('Image placement failed:', imgErr);
          }
        }

        // Content
        doc.fillColor('#FF9F0A').fontSize(12).text('MOVIEBOOK PREMIUM CINEMA', 0, 20, { align: 'center' });

        const titleY = 310;
        doc.fillColor('#FFFFFF').fontSize(26).text(fixHebrew(movieTitle || 'Movie Ticket'), 30, titleY, { align: 'center', width: width - 60 });

        doc.moveTo(50, titleY + 50).lineTo(width - 50, titleY + 50).lineWidth(1).stroke('rgba(255, 255, 255, 0.1)');

        const gridY = titleY + 75;
        const drawField = (label: string, value: string, x: number, y: number, align: 'left' | 'right') => {
          doc.fillColor('rgba(255, 255, 255, 0.5)').fontSize(10).text(fixHebrew(label), x, y, { align, width: 140 });
          doc.fillColor('#FFFFFF').fontSize(14).text(fixHebrew(value || '-'), x, y + 15, { align, width: 140 });
        };

        drawField('שם המזמין', userName || 'אורח', width - 170, gridY, 'right');
        drawField('תאריך', date || '-', width - 170, gridY + 60, 'right');
        drawField('אולם', hall || 'אולם 01', width - 170, gridY + 120, 'right');

        drawField('שעה', time || '-', 30, gridY, 'left');
        drawField('מושבים', Array.isArray(seats) ? seats.join(', ') : (seats || '-'), 30, gridY + 60, 'left');
        drawField('מחיר', `${price || 0} ₪`, 30, gridY + 120, 'left');

        const stubY = height - 120;
        doc.rect(0, stubY, width, 120).fill('rgba(255, 159, 10, 0.05)');
        doc.moveTo(0, stubY).lineTo(width, stubY).dash(5, { space: 5 }).stroke('rgba(255, 255, 255, 0.2)');
        doc.undash();

        if (qrBuffer) {
          const qrSize = 60;
          doc.rect(width / 2 - qrSize / 2 - 5, stubY + 20, qrSize + 10, qrSize + 10).fill('#FFFFFF');
          doc.image(qrBuffer, width / 2 - qrSize / 2, stubY + 25, { width: qrSize, height: qrSize });
        }

        doc.fillColor('rgba(255, 255, 255, 0.3)').fontSize(9).font('Helvetica').text(`ORDER ID: ${orderId || 'N/A'}`, 0, stubY + 95, { align: 'center', width: width });
        
        // Finalize
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
    console.error('PDF Download API Error:', err);
    return NextResponse.json({ 
      success: false,
      error: (err as Error).message 
    }, { status: 500 });
  }
}
