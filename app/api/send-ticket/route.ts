import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function POST(req: Request) {
  try {
    const { email, movieTitle, seats, price, orderId, posterUrl, date, time, hall } = await req.json();

    const subject = `🎬 הכרטיס שלך לסרט ${movieTitle} מוכן!`;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    const messageParts = [
      `From: MovieBook <${process.env.GMAIL_USER}>`,
      `To: ${email}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      `
        <div dir="rtl" style="font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif; background-color: #050505; color: #FFFFFF; padding: 40px; border-radius: 32px; max-width: 600px; margin: auto; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; padding: 10px 20px; background: rgba(255, 159, 10, 0.1); border: 1px solid rgba(255, 159, 10, 0.2); border-radius: 12px;">
              <h1 style="color: #FF9F0A; font-size: 24px; margin: 0; font-weight: 900; letter-spacing: 2px;">MOVIEBOOK</h1>
            </div>
            <p style="color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px;">The Premium Cinema Experience</p>
          </div>

          <!-- Main Ticket Card -->
          <div style="background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border-radius: 28px; padding: 35px; border: 1px solid rgba(255, 255, 255, 0.1); position: relative; overflow: hidden;">
            
            <!-- Glow Effect -->
            <div style="position: absolute; top: -100px; left: -100px; width: 200px; height: 200px; background: rgba(255, 159, 10, 0.05); filter: blur(60px); border-radius: 50%;"></div>

            <!-- Movie Poster & Title -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${posterUrl}" alt="${movieTitle}" style="width: 160px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;" />
              <h2 style="font-size: 28px; font-weight: 800; margin: 0; color: #FFFFFF; line-height: 1.2;">${movieTitle}</h2>
            </div>

            <!-- Details Grid -->
            <div style="background: rgba(0,0,0,0.3); border-radius: 20px; padding: 25px; border: 1px solid rgba(255,255,255,0.05);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <span style="color: #64748B; font-size: 12px; display: block; margin-bottom: 4px;">תאריך</span>
                    <span style="font-weight: 700; color: #F1F5F9;">${date || 'ייקבע בקרוב'}</span>
                  </td>
                  <td style="padding-bottom: 15px; text-align: left;">
                    <span style="color: #64748B; font-size: 12px; display: block; margin-bottom: 4px;">שעה</span>
                    <span style="font-weight: 700; color: #F1F5F9;">${time || 'ייקבע בקרוב'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #64748B; font-size: 12px; display: block; margin-bottom: 4px;">אולם</span>
                    <span style="font-weight: 700; color: #F1F5F9;">${hall || 'אולם 1'}</span>
                  </td>
                  <td style="padding-top: 15px; text-align: left; border-top: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #64748B; font-size: 12px; display: block; margin-bottom: 4px;">מושבים</span>
                    <span style="font-weight: 700; color: #FF9F0A;">${seats.join(', ')}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Order ID Barcode-ish -->
            <div style="margin-top: 30px; padding-top: 25px; border-top: 2px dashed rgba(255,255,255,0.1); text-align: center;">
              <span style="color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 10px;">מספר הזמנה</span>
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; color: #FFFFFF; letter-spacing: 4px;">#${orderId}</span>
            </div>
          </div>

          <!-- Price & Footer -->
          <div style="margin-top: 35px; text-align: center;">
            <div style="margin-bottom: 25px;">
              <span style="color: #94A3B8; font-size: 14px;">סה"כ שולם:</span>
              <span style="font-size: 24px; font-weight: 900; color: #FF9F0A; margin-right: 8px;">₪${price}</span>
            </div>
            
            <p style="color: #64748B; font-size: 14px; line-height: 1.6;">תודה שבחרת ב-MovieBook. אנחנו מחכים להעניק לך את החוויה הקולנועית הטובה ביותר.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="display: inline-block; padding: 16px 32px; background: #FF9F0A; color: #000000; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(255, 159, 10, 0.2);">הורדת כרטיס למכשיר</a>
            </div>
          </div>
        </div>
      `,
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Gmail API error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
