const { google } = require('googleapis');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'MOCK_CLIENT_SECRET';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || 'MOCK_REFRESH_TOKEN';
const GMAIL_USER = process.env.GMAIL_USER || 'user@example.com';

async function testGmailSend() {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    console.log('Testing Gmail send...');
    const subject = 'Test from MovieBook AI';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const message = [
      `From: MovieBook <${GMAIL_USER}>`,
      `To: ${GMAIL_USER}`,
      `Subject: ${utf8Subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=utf-8`,
      '',
      'This is a test email to verify authentication scopes.'
    ].join('\r\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
    console.log('Send successful!');
    console.log('Response:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Send failed!');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGmailSend();
