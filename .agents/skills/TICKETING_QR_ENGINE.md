# 🎟️ Ticketing & QR Engine Skill (v1.0)

This skill governs the generation, distribution, and validation of movie tickets.

## 🗝️ Core Principles
1. **Visual Consistency**: Tickets must reflect the "Liquid Glass" aesthetic, even in PDF format.
2. **RTL Integrity**: Hebrew text in tickets must be correctly rendered (no reversed characters).
3. **Uniqueness**: Every QR code must be cryptographically signed to prevent fraud.

## 🛠️ Implementation Specs

### 1. PDF Generation (RTL Support)
When generating PDFs (e.g., with `react-pdf` or `jspdf`), ensure fonts are embedded and LTR/RTL mixed text is handled:
```typescript
// Pattern for handling Hebrew in PDFs
const processRTLText = (text: string) => {
  if (/[\u0590-\u05FF]/.test(text)) {
    return text.split('').reverse().join(''); // Simplified - use a robust library if available
  }
  return text;
};
```

### 2. QR Code Standard
- **Format**: JSON payload or unique URL.
- **Payload**: `{ ticketId: string, timestamp: number, signature: string }`.
- **Library**: `qrcode.react` for web, `react-native-qrcode-svg` for mobile.

### 3. Distribution Pipeline
1. **Success Hook**: Trigger PDF generation after payment confirmation.
2. **Email Service**: Send ticket via SendGrid/Resend with a high-depth glassmorphic email template.
3. **Wallet Integration**: Provide "Add to Apple/Google Wallet" options where possible.

## 🔍 Audit Checklist
- [ ] Does the ticket display the correct seat number and cinema hall?
- [ ] Is the QR code scannable in low brightness (dark mode)?
- [ ] Is the PDF file size < 500KB for fast downloads?
