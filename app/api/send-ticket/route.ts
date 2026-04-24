import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
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

// Helper to handle Hebrew text in PDFKit
const fixHebrew = (text: string) => {
  if (!text) return '';
  // PDFKit doesn't handle RTL. We need to reverse Hebrew words but keep non-Hebrew ones.
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
    const { email, movieTitle, seats, price, orderId, posterUrl, date, time, hall, userName } = await req.json();
    console.log('Sending ticket email to:', email, 'for movie:', movieTitle);

    // 1. Generate PDF
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

    // 2. Generate PDF
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      try {
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Assistant-Bold.ttf');
        const hasFont = fs.existsSync(fontPath);
        
        const doc = new PDFDocument({ 
          margin: 0, // No margin for full background
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
        
        // Gradient-like overlay (subtle rects)
        doc.rect(0, 0, width, 150).fill('rgba(255, 159, 10, 0.05)');

        // Poster Image
        if (imageBuffer) {
          const imgWidth = 140;
          const imgHeight = 210;
          const imgX = (width - imgWidth) / 2;
          doc.image(imageBuffer, imgX, 40, { width: imgWidth, height: imgHeight });
          
          // Border for image
          doc.rect(imgX, 40, imgWidth, imgHeight).lineWidth(1).stroke('rgba(255, 255, 255, 0.1)');
        }

        // Header Title
        doc.fillColor('#FF9F0A').fontSize(10).font(hasFont ? 'Hebrew' : 'Helvetica').text('MOVIEBOOK DIGITAL TICKET', 0, 20, { align: 'center', characterSpacing: 2 });

        // Movie Title
        const titleY = 270;
        doc.fillColor('#FFFFFF').fontSize(24).text(fixHebrew(movieTitle), 30, titleY, { align: 'center', width: width - 60 });

        // Separator line
        doc.moveTo(40, titleY + 45).lineTo(width - 40, titleY + 45).lineWidth(0.5).stroke('rgba(255, 255, 255, 0.1)');

        // Details Grid
        const gridY = titleY + 65;
        const col1 = width - 150;
        const col2 = width - 40;

        const drawLabelValue = (label: string, value: string, y: number) => {
          doc.fillColor('rgba(255, 255, 255, 0.4)').fontSize(9).text(fixHebrew(label), col1, y, { align: 'right', width: col2 - col1 });
          doc.fillColor('#FFFFFF').fontSize(12).text(fixHebrew(value), col1, y + 12, { align: 'right', width: col2 - col1 });
        };

        drawLabelValue('שם המזמין', userName || 'אורח', gridY);
        drawLabelValue('תאריך', date, gridY + 45); // value 'date' is usually numeric/english
        drawLabelValue('שעה', time, gridY + 90);

        // Right side of grid
        const col3 = 40;
        const col4 = 150;
        const drawLabelValueLeft = (label: string, value: string, y: number) => {
          doc.fillColor('rgba(255, 255, 255, 0.4)').fontSize(9).text(fixHebrew(label), col3, y, { align: 'left', width: col4 - col3 });
          doc.fillColor('#FFFFFF').fontSize(12).text(fixHebrew(value), col3, y + 12, { align: 'left', width: col4 - col3 });
        };

        drawLabelValueLeft('אולם', hall, gridY);
        drawLabelValueLeft('מושבים', Array.isArray(seats) ? seats.join(', ') : seats, gridY + 45);
        drawLabelValueLeft('סה"כ לתשלום', `${price} ₪`, gridY + 90);

        // Dashed line (Stub tear effect)
        doc.moveTo(0, height - 60).lineTo(width, height - 60).dash(5, { space: 5 }).lineWidth(1).stroke('rgba(255, 159, 10, 0.3)');
        doc.undash();

        // Footer / Order ID
        doc.fillColor('rgba(255, 255, 255, 0.2)').fontSize(8).text(`ORDER ID: ${orderId}`, 0, height - 40, { align: 'center' });
        doc.fillColor('#FF9F0A').fontSize(10).text(fixHebrew('תודה שבחרת ב-MovieBook!'), 0, height - 25, { align: 'center' });

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
    console.log('Gmail send response status:', gmailRes.status);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Gmail API error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
