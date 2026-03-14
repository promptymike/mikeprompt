export type AnonymizationMap = Record<string, string>;

interface Match {
  placeholder: string;
  original: string;
  start: number;
  end: number;
}

// Order matters — more specific / longer patterns first to avoid partial overlaps
const PATTERNS: Array<{ regex: RegExp; type: string }> = [
  // IBAN (before bare digit sequences)
  { regex: /\b(?:PL|DE|GB|FR|NL|ES|IT|AT|BE|CH)\d{2}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{0,4}\b/gi, type: "IBAN" },
  // Email
  { regex: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g, type: "EMAIL" },
  // NIP formatted (xxx-xxx-xx-xx or xxx-xx-xx-xxx)
  { regex: /\b\d{3}-\d{3}-\d{2}-\d{2}\b|\b\d{3}-\d{2}-\d{2}-\d{3}\b/g, type: "NIP" },
  // PESEL: exactly 11 digits (before unformatted NIP to avoid conflict)
  { regex: /\b\d{11}\b/g, type: "PESEL" },
  // NIP unformatted: exactly 10 digits
  { regex: /\b\d{10}\b/g, type: "NIP" },
  // Polish phone: +48... or xxx-xxx-xxx or xxx xxx xxx
  { regex: /(?:\+48[\s\-]?)?\b\d{3}[\s\-]\d{3}[\s\-]\d{3}\b|\+48\d{9}\b/g, type: "PHONE" },
  // Amounts with currency symbols
  { regex: /\b\d{1,3}(?:[\s ]\d{3})*(?:[.,]\d{2})?\s*(?:PLN|EUR|USD|GBP|zł|CHF)\b|\b(?:PLN|EUR|USD|GBP|zł|CHF)\s*\d[\d\s.,]*/g, type: "AMOUNT" },
  // Dates: dd.mm.yyyy / dd/mm/yyyy / yyyy-mm-dd
  { regex: /\b\d{1,2}[./]\d{1,2}[./]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g, type: "DATE" },
  // Polish company suffixes
  { regex: /(?:[A-ZŻŹĆĄŚĘŁÓŃ][a-zA-ZżźćąśęłóńŻŹĆĄŚĘŁÓŃ\s&"'.\-]+\s+)?(?:sp(?:ółka)?\.?\s*z\s*o(?:graniczoną)?\.?\s*o(?:dpowiedzialnością)?\.?|S\.A\.|Sp\.?\s*K\.?|s\.c\.)/g, type: "COMPANY" },
];

export const anonymizeText = (text: string): { anonymized: string; map: AnonymizationMap } => {
  const map: AnonymizationMap = {};
  const counters: Record<string, number> = {};
  const usedRanges: Array<[number, number]> = [];
  const matches: Match[] = [];

  const overlaps = (start: number, end: number) =>
    usedRanges.some(([s, e]) => start < e && end > s);

  for (const { regex, type } of PATTERNS) {
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (overlaps(start, end)) continue;
      counters[type] = (counters[type] ?? 0) + 1;
      const placeholder = `[${type}_${counters[type]}]`;
      matches.push({ placeholder, original: m[0], start, end });
      map[placeholder] = m[0];
      usedRanges.push([start, end]);
    }
  }

  // Replace from end to start to preserve indices
  matches.sort((a, b) => b.start - a.start);
  let result = text;
  for (const { placeholder, start, end } of matches) {
    result = result.slice(0, start) + placeholder + result.slice(end);
  }

  return { anonymized: result, map };
};

export const deanonymize = (text: string, map: AnonymizationMap): string => {
  let result = text;
  for (const [placeholder, original] of Object.entries(map)) {
    result = result.split(placeholder).join(original);
  }
  return result;
};
