import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Helper to handle Hebrew text in PDFKit for RTL with better mixed content support
const fixHebrew = (text: string) => {
  if (!text) return '';
  // Split into segments of Hebrew, and everything else
  const parts = text.split(/([\u0590-\u05FF]+)/);
  const fixedParts = parts.map(part => {
    // Only reverse the Hebrew character sequence
    if (/[\u0590-\u05FF]/.test(part)) {
      return part.split('').reverse().join('');
    }
    return part;
  });
  
  // Rejoin and reverse the entire string to put Hebrew in correct visual order
  // Then we have to re-reverse non-hebrew parts because they were reversed by the global reverse
  return fixedParts.reverse().join('');
};

export async function POST(req: Request) {
  try {
    const { email, movieTitle, seats, price, orderId, posterUrl, date, time, hall, userName } = await req.json();
    console.log('Sending ticket email to:', email, 'for movie:', movieTitle);

    // 1. Fetch Poster Image & Generate QR Code
    let imageBuffer: Buffer | null = null;
    let qrBuffer: Buffer | null = null;
    
    try {
      if (posterUrl) {
        const response = await fetch(posterUrl);
        if (response.ok) imageBuffer = Buffer.from(await response.arrayBuffer());
      }
      qrBuffer = await QRCode.toBuffer(orderId, {
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
        width: 150
      });
    } catch (e) {
      console.error('Failed to prepare assets for PDF:', e);
    }

    // 2. Generate PDF
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      try {
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Assistant-Bold.ttf');
        const hasFont = fs.existsSync(fontPath);
        
        const doc = new PDFDocument({ 
          margin: 0, 
          size: [400, 640],
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
        
        // Premium Glow (Top)
        doc.rect(0, 0, width, 4).fill('#FF9F0A');
        
        // Poster Image
        if (imageBuffer) {
          const imgWidth = 140;
          const imgHeight = 210;
          const imgX = (width - imgWidth) / 2;
          doc.image(imageBuffer, imgX, 40, { width: imgWidth, height: imgHeight });
          // Border
          doc.rect(imgX, 40, imgWidth, imgHeight).lineWidth(1).stroke('rgba(255, 159, 10, 0.4)');
        }

        // Header
        doc.fillColor('#FF9F0A').fontSize(10).font(hasFont ? 'Hebrew' : 'Helvetica-Bold').text('MOVIEBOOK PREMIUM CINEMA', 0, 20, { align: 'center' });

        // Movie Title
        const titleY = 270;
        doc.fillColor('#FFFFFF').fontSize(24).text(fixHebrew(movieTitle), 30, titleY, { align: 'center', width: width - 60 });

        // Detail Fields Grid
        const gridY = titleY + 60;
        const drawField = (label: string, value: string, x: number, y: number, align: 'left' | 'right') => {
          doc.fillColor('rgba(255, 255, 255, 0.4)').fontSize(9).text(fixHebrew(label), x, y, { align, width: 150 });
          doc.fillColor('#FFFFFF').fontSize(13).text(fixHebrew(value), x, y + 15, { align, width: 150 });
        };

        // Right side (Hebrew primary)
        drawField('שם המזמין', userName || 'אורח', width - 180, gridY, 'right');
        drawField('תאריך', date, width - 180, gridY + 50, 'right');
        drawField('אולם', hall, width - 180, gridY + 100, 'right');

        // Left side
        drawField('שעה', time, 30, gridY, 'left');
        drawField('מושבים', Array.isArray(seats) ? seats.join(', ') : seats, 30, gridY + 50, 'left');
        drawField('מחיר', `${price} ₪`, 30, gridY + 100, 'left');

        // Security Stub Separator
        const stubY = height - 160;
        doc.moveTo(30, stubY).lineTo(width - 30, stubY).dash(5, { space: 3 }).stroke('rgba(255, 255, 255, 0.15)');
        doc.undash();

        // QR Code & Order ID
        if (qrBuffer) {
          const qrSize = 80;
          doc.rect(width / 2 - qrSize/2 - 5, stubY + 20, qrSize + 10, qrSize + 10).fill('#FFFFFF');
          doc.image(qrBuffer, width / 2 - qrSize/2, stubY + 25, { width: qrSize, height: qrSize });
        }

        doc.fillColor('rgba(255, 255, 255, 0.3)').fontSize(8).font('Helvetica').text(`ORDER ID: ${orderId}`, 0, stubY + 115, { align: 'center', width: width });
        doc.fillColor('#FF9F0A').fontSize(11).font(hasFont ? 'Hebrew' : 'Helvetica-Bold').text(fixHebrew('תודה שבחרת ב-MovieBook!'), 0, stubY + 135, { align: 'center', width: width });

        doc.end();
      } catch (e) {
        console.error('PDF Generation Error:', e);
        reject(e);
      }
    });

    const subject = `🎬 הכרטיס שלך לסרט ${movieTitle} מוכן!`;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    // 2. Build Multipart Email Message
    const boundary = '__boundary__';
    const nl = '\r\n';
    
    const htmlBody = `
        <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif; background-color: #0F0F0F; color: #FFFFFF; padding: 20px; margin: 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: auto; background-color: #161616; border-radius: 32px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 40px 100px rgba(0,0,0,0.8);">
            <tr>
              <td align="center" style="padding: 30px 20px 20px 20px;">
                <div style="letter-spacing: 6px; color: #FF9F0A; font-weight: 900; font-size: 14px; text-transform: uppercase; opacity: 0.9;">MOVIEBOOK</div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 40px 30px 40px;">
                <img src="${posterUrl}" width="100%" style="display: block; border-radius: 20px; max-width: 300px;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 30px 10px 30px;">
                <h1 style="font-size: 28px; font-weight: 900; margin: 0; color: #FFFFFF;">${movieTitle}</h1>
                <p style="color: #FF9F0A; margin: 10px 0;">שלום ${userName || 'אורח'}, צירפנו את הכרטיס הדיגיטלי שלך!</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 30px 40px 30px;">
                <p style="color: rgba(255,255,255,0.4); font-size: 12px;">מצ"ב קובץ PDF עם פרטי הכרטיס. יש להציגו בכניסה.</p>
              </td>
            </tr>
          </table>
        </div>
    `;

    const message = [
      `From: MovieBook <${process.env.GMAIL_USER}>`,
      `To: ${email}`,
      `Subject: ${utf8Subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: 7bit`,
      '',
      htmlBody,
      '',
      `--${boundary}`,
      `Content-Type: application/pdf`,
      `Content-Disposition: attachment; filename="ticket-${orderId}.pdf"`,
      `Content-Transfer-Encoding: base64`,
      '',
      pdfBuffer.toString('base64'),
      '',
      `--${boundary}--`,
    ].join(nl);

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const gmailRes = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
    console.log('Gmail send response status:', gmailRes.status, 'Data:', gmailRes.data);

    return NextResponse.json({ success: true, data: { messageId: gmailRes.data.id } });
  } catch (err) {
    console.error('Gmail API error details:', err);
    return NextResponse.json({ 
      success: false, 
      error: (err as Error).message,
      details: err 
    }, { status: 500 });
  }
}
