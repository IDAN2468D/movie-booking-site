import { RawOrderInput } from './types';

function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

interface ColumnMapping {
  dateIdx: number;
  titleIdx: number;
  amountIdx: number;
  userIdx: number;
  statusIdx: number;
  qtyIdx: number;
}

function detectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    dateIdx: -1,
    titleIdx: -1,
    amountIdx: -1,
    userIdx: -1,
    statusIdx: -1,
    qtyIdx: -1,
  };

  headers.forEach((h, idx) => {
    const clean = h.toLowerCase().replace(/["'\s_]/g, '');
    if (mapping.dateIdx === -1 && /תאריך|date|eventdate|time/.test(clean)) {
      mapping.dateIdx = idx;
    } else if (mapping.titleIdx === -1 && /שםסרט|סרט|itemname|movietitle|movie|title|film/.test(clean)) {
      mapping.titleIdx = idx;
    } else if (mapping.amountIdx === -1 && /סכום|מחיר|סה״כ|סה"כ|revenue|amount|price|total|itemrevenue/.test(clean)) {
      mapping.amountIdx = idx;
    } else if (mapping.userIdx === -1 && /לקוח|משתמש|אימייל|מייל|user|email|customer|userid|transactionid/.test(clean)) {
      mapping.userIdx = idx;
    } else if (mapping.statusIdx === -1 && /סטטוס|מצב|status/.test(clean)) {
      mapping.statusIdx = idx;
    } else if (mapping.qtyIdx === -1 && /כמות|כרטיסים|qty|quantity|count/.test(clean)) {
      mapping.qtyIdx = idx;
    }
  });

  return mapping;
}

export function parseCsvOrPastedText(rawText: string): RawOrderInput[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  // Detect delimiter (Tab or Comma or Semicolon)
  const firstLine = lines[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const delimiter = tabCount > commaCount && tabCount > semiCount ? '\t' : semiCount > commaCount ? ';' : ',';

  const firstLineCells = splitCsvLine(firstLine, delimiter);
  const mapping = detectColumns(firstLineCells);

  const hasDetectedHeader = mapping.dateIdx !== -1 || mapping.titleIdx !== -1 || mapping.amountIdx !== -1;
  const startIndex = hasDetectedHeader ? 1 : 0;

  const results: RawOrderInput[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i], delimiter);
    if (cells.length === 0 || (cells.length === 1 && !cells[0])) continue;

    let date = '';
    let title = '';
    let amount: number | string = 0;
    let user = '';
    let status = 'completed';
    let qty = 1;

    if (hasDetectedHeader) {
      if (mapping.dateIdx >= 0 && cells[mapping.dateIdx]) date = cells[mapping.dateIdx];
      if (mapping.titleIdx >= 0 && cells[mapping.titleIdx]) title = cells[mapping.titleIdx];
      if (mapping.amountIdx >= 0 && cells[mapping.amountIdx]) amount = cells[mapping.amountIdx];
      if (mapping.userIdx >= 0 && cells[mapping.userIdx]) user = cells[mapping.userIdx];
      if (mapping.statusIdx >= 0 && cells[mapping.statusIdx]) status = cells[mapping.statusIdx];
      if (mapping.qtyIdx >= 0 && cells[mapping.qtyIdx]) qty = parseInt(cells[mapping.qtyIdx], 10) || 1;
    } else {
      // Fallback heuristics: date is first date-like cell, amount is numeric cell, title is text
      cells.forEach((cell) => {
        if (!date && (/^\d{1,4}[\/\.-]\d{1,2}[\/\.-]\d{2,4}$/.test(cell) || /^\d{8}$/.test(cell))) {
          date = cell;
        } else if (!amount && /^[₪$€\s]*\d+([\.,]\d+)?\s*[₪$€\w"]*$/.test(cell)) {
          amount = cell;
        } else if (!title && cell.length > 1) {
          title = cell;
        } else if (!user && cell.includes('@')) {
          user = cell;
        }
      });
    }

    if (title || amount) {
      results.push({
        orderId: `import_${i}_${Date.now()}`,
        date: date || new Date().toISOString().split('T')[0],
        movieTitle: title || 'סרט כללי',
        amount: amount || 0,
        customerEmail: user || undefined,
        status: status || 'completed',
        quantity: qty,
      });
    }
  }

  return results;
}
