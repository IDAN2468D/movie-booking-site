import crypto from 'crypto';

const CRYPTO_SECRET = process.env.PASSBOOK_HMAC_SECRET || 'cinepulse_default_hmac_secret_2026';

export function generateHMACSignature(payload: string): string {
  return crypto
    .createHmac('sha256', CRYPTO_SECRET)
    .update(payload)
    .digest('hex');
}

export function verifyHMACSignature(payload: string, signature: string): boolean {
  const expectedSignature = generateHMACSignature(payload);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}
