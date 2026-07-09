export function getLuminance(hex: string) {
  // Extract RGB and calculate luminance
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return 0; // Fallback
  }
  
  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function ensureWCAGContrast(hex: string, backgroundHex: string = '#000000', targetRatio: number = 3.0): string {
  if (!hex || !hex.startsWith('#') || hex.length !== 7) return '#FF1464';

  const l1 = getLuminance(hex);
  const l2 = getLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  if (ratio >= targetRatio) return hex;
  // If the color fails contrast against black, provide a default safe vivid pink
  return '#FF1464'; 
}
