import { RawTransaction } from '@/lib/types/transaction';

/**
 * Remove acentos e converte para minúsculo
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Auto-detecta o delimitador do CSV (; , ou \t)
 */
export function detectDelimiter(headerLine: string): string {
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  const tabs = (headerLine.match(/\t/g) || []).length;

  if (semicolons >= commas && semicolons >= tabs && semicolons > 0) return ';';
  if (tabs >= commas && tabs > 0) return '\t';
  return ',';
}

/**
 * Converte valor em formato string brasileiro ou internacional para number
 * Ex: "-55,90" -> 55.9, "55.90" -> 55.9, "R$ 119,90" -> 119.9
 */
export function parseCurrencyAmount(valStr: string): { amount: number; isNegative: boolean } {
  if (!valStr) return { amount: 0, isNegative: false };

  const cleaned = valStr.replace(/[R$\s]/g, '').trim();
  const isNegative = cleaned.startsWith('-') || cleaned.includes('DEB');

  // Remove sinais negativos e positivos para parsing
  let numStr = cleaned.replace(/[-+]/g, '').trim();

  // Se tiver vírgula como decimal (ex: 55,90 ou 1.250,50)
  if (numStr.includes(',')) {
    numStr = numStr.replace(/\./g, '').replace(',', '.');
  }

  const parsed = parseFloat(numStr);
  const amount = isNaN(parsed) ? 0 : Math.abs(parsed);

  return { amount, isNegative };
}

/**
 * Normaliza datas para YYYY-MM-DD
 * Suporta DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
 */
export function parseTransactionDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const cleaned = dateStr.trim();

  // DD/MM/YYYY ou DD-MM-YYYY
  const brMatch = cleaned.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // YYYY-MM-DD
  const isoMatch = cleaned.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return cleaned;
}

/**
 * Realiza o parsing de conteúdo CSV de extratos bancários para RawTransaction[]
 */
export function parseCSVStatement(csvContent: string): RawTransaction[] {
  if (!csvContent || !csvContent.trim()) return [];

  const rawLines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length < 2) return [];

  const headerLine = rawLines[0];
  const delimiter = detectDelimiter(headerLine);

  const headers = headerLine.split(delimiter).map((h) => normalizeText(h));

  // Identificação de índices das colunas
  let dateIndex = headers.findIndex((h) => h.includes('data') || h.includes('date') || h.includes('dt'));
  let descIndex = headers.findIndex(
    (h) => h.includes('titulo') || h.includes('descricao') || h.includes('lancamento') || h.includes('historico') || h.includes('memo') || h.includes('estabelecimento')
  );
  let amountIndex = headers.findIndex((h) => h.includes('valor') || h.includes('amount') || h.includes('total'));

  // Fallbacks padrão caso o cabeçalho não seja óbvio
  if (dateIndex === -1) dateIndex = 0;
  if (descIndex === -1) descIndex = headers.length > 1 ? 1 : 0;
  if (amountIndex === -1) amountIndex = headers.length > 2 ? 2 : headers.length - 1;

  const transactions: RawTransaction[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i];
    const columns = line.split(delimiter);

    if (columns.length <= Math.max(dateIndex, descIndex, amountIndex)) {
      continue;
    }

    const rawDate = columns[dateIndex];
    const rawDesc = columns[descIndex];
    const rawAmount = columns[amountIndex];

    if (!rawDesc || !rawAmount) continue;

    const { amount } = parseCurrencyAmount(rawAmount);
    if (amount <= 0) continue;

    const normalizedDate = parseTransactionDate(rawDate);
    const cleanedDesc = rawDesc.trim().replace(/^["']|["']$/g, '');

    transactions.push({
      id: `tx-${i}-${Math.random().toString(36).substring(2, 7)}`,
      date: normalizedDate,
      description: cleanedDesc,
      amount,
      type: 'DEBIT',
      rawText: line,
    });
  }

  return transactions;
}
