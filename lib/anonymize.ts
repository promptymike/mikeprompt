export type AnonymizationMap = Record<string, string>;

export const anonymizeText = (text: string): {
  anonymized: string;
  map: AnonymizationMap;
} => {
  const map: AnonymizationMap = {};
  let result = text;
  let counter = 1;

  const mask = (pattern: RegExp, label: string) => {
    result = result.replace(pattern, (match) => {
      const key = `[${label}_${counter++}]`;
      map[key] = match;
      return key;
    });
  };

  // Email
  mask(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "EMAIL");

  // IBAN PL
  mask(/PL\s?\d{2}[\s\d]{26,32}/gi, "IBAN");

  // PESEL (11 cyfr)
  mask(/\b\d{11}\b/g, "PESEL");

  // NIP (10 cyfr z opcjonalnymi myślnikami/spacjami: xxx-xxx-xx-xx)
  mask(/\b\d{3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}\b/g, "NIP");

  // Telefon PL
  mask(/(\+48[\s\-]?)?\b\d{3}[\s\-]?\d{3}[\s\-]?\d{3}\b/g, "TELEFON");

  // Kwoty z walutą
  mask(/\b\d{1,3}(?:[\s,]\d{3})*(?:[,.]\d{2})?\s*(?:zł|PLN|USD|EUR|GBP|€|\$|£)/gi, "KWOTA");

  // Daty DD.MM.YYYY lub YYYY-MM-DD
  mask(/\b\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{2,4}\b/g, "DATA");

  return { anonymized: result, map };
};

export const deanonymize = (text: string, map: AnonymizationMap): string => {
  let result = text;
  for (const [key, value] of Object.entries(map)) {
    result = result.split(key).join(value);
  }
  return result;
};
