import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL // Or any authorized redirect URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function POST(req: Request) {
  try {
    const { email, movieTitle, seats, price, orderId, posterUrl } = await req.json();

    const subject = `🎬 הכרטיסים שלך ל-${movieTitle} מחכים לך!`;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    
    const messageParts = [
      `From: MovieBook <${process.env.GMAIL_USER}>`,
      `To: ${email}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0F0F0F; color: #FFFFFF; padding: 40px; border-radius: 24px; max-width: 600px; margin: auto; border: 1px solid rgba(255, 159, 10, 0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF9F0A; font-size: 28px; margin: 0; letter-spacing: -1px;">MOVIEBOOK</h1>
            <p style="color: rgba(255, 159, 10, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Premium Cinema Experience</p>
          </div>

          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="margin-bottom: 25px; text-align: center;">
              <img src="${posterUrl}" alt="${movieTitle}" style="width: 150px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
            </div>

            <h2 style="font-size: 22px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">פרטי ההזמנה</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #94A3B8;">סרט:</span>
              <span style="font-weight: bold;">${movieTitle}</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #94A3B8;">מושבים:</span>
              <span style="font-weight: bold; color: #FF9F0A;">${seats.join(', ')}</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #94A3B8;">מספר הזמנה:</span>
              <span style="font-family: monospace;">#${orderId}</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 1px dotted rgba(255,255,255,0.2);">
              <span style="font-size: 18px;">סה"כ לתשלום:</span>
              <span style="font-size: 18px; font-weight: bold; color: #FF9F0A;">₪${price}</span>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #94A3B8; font-size: 14px;">
            <p>תודה שבחרת ב-MovieBook! נתראה בקולנוע.</p>
            <div style="margin-top: 20px;">
              <div style="display: inline-block; padding: 12px 24px; background-color: #FF9F0A; color: #000000; border-radius: 12px; text-decoration: none; font-weight: bold;">הצג כרטיס דיגיטלי</div>
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
