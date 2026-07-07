export async function generateTicketHash(
  userId: string,
  orderId: string,
  seatIds: string[],
  secretSalt: string = 'KINETIC_FUSION_SALT_v1'
): Promise<string> {
  const payload = `${userId}-${orderId}-${seatIds.join(',')}-${secretSalt}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  
  // Use Universal Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export function isNetworkOnline(): boolean {
  return typeof window !== 'undefined' ? navigator.onLine : true;
}
