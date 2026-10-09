import { normalizeText } from '@/lib/parsers/csv-parser';

/**
 * Lista de termos e palavras-chave de estabelecimentos cotidianos
 * que NUNCA devem ser considerados assinaturas (alimentação, mercado, farmácia, transporte avulso, etc.)
 */
export const EVERYDAY_EXPENSES_BLOCKLIST = [
  // Alimentação & Bebidas (Lanchonetes, Bares, Restaurantes, Padarias)
  'lanchonete',
  'lanches',
  'lanche',
  'padaria',
  'panificadora',
  'restaurante',
  'bar',
  'boteco',
  'cafeteria',
  'cafe',
  'pizzaria',
  'pizza',
  'hamburguer',
  'burger',
  'mcdonald',
  'mc donald',
  'subway',
  'burguer king',
  'churrascaria',
  'sorveteria',
  'acai',
  'pastelaria',
  'esfiharia',
  'cacau show',
  'kopenhagen',
  'doceria',

  // Mercados & Compras de Casa
  'supermercado',
  'mercado',
  'mercadinho',
  'hortifruti',
  'acougue',
  'peixaria',
  'atacadao',
  'assai',
  'carrefour',
  'pao de acucar',
  'extra',
  'big',
  'sonda',
  'dia brasil',
  'mercearia',
  'quitanda',

  // Farmácias & Saúde Avulsa
  'farmacia',
  'drogaria',
  'droga raia',
  'drogasil',
  'pague menos',
  'sao paulo drogaria',
  'ultrafarma',
  'panvel',

  // Automotivo & Transporte Avulso
  'posto',
  'gasolina',
  'combustivel',
  'etanol',
  'diesel',
  'shell',
  'ipiranga',
  'petrobras',
  'auto posto',
  'estacionamento',
  'pedagio',
  'sem parar',
  'conectcar',
  'lavajato',
  'lava rapido',
  'uber *viagem',
  'uber trip',
  '99app',
  '99 pop',
  '99 corrida',

  // Delivery Avulso de Comida
  'ifood',
  'rappi',
  'ze delivery',
  'aiqfome',
  'deliway',

  // Lojas Físicas / Varejo Não Recorrente
  'shopee',
  'aliexpress',
  'shein',
  'lojas americanas',
  'magazine luiza',
  'magalu',
  'casas bahia',
  'pontofrio',
  'zara',
  'renner',
  'riachuelo',
  'c&a',
  'centauro',
  'decathlon',
  'leroy merlin',
  'petz',
  'cobasi',
];

/**
 * Padrão para detecção de compras parceladas (ex: 01/10, 02/06, PARC 3)
 */
export const INSTALLMENT_REGEX = /\b(\d{1,2}\/\d{1,2}|parc(ela)?(\.|\s|\d)?)\b/i;

export interface BlocklistCheckResult {
  isBlocked: boolean;
  reason?: 'EVERYDAY_EXPENSE' | 'INSTALLMENT' | 'TRANSFER_OR_WITHDRAWAL';
  matchedTerm?: string;
}

/**
 * Verifica se a descrição pertence à lista de bloqueio ou é compra parcelada
 */
export function checkBlocklist(description: string): BlocklistCheckResult {
  const normalized = normalizeText(description);

  // 1. Checa compras parceladas (ex: 01/10, 2/12)
  if (INSTALLMENT_REGEX.test(normalized)) {
    const match = normalized.match(INSTALLMENT_REGEX);
    return {
      isBlocked: true,
      reason: 'INSTALLMENT',
      matchedTerm: match ? match[0] : 'parcela',
    };
  }

  // 2. Checa estabelecimentos cotidianos (lanchonetes, mercados, padarias, etc.)
  for (const blockedTerm of EVERYDAY_EXPENSES_BLOCKLIST) {
    if (normalized.includes(blockedTerm)) {
      return {
        isBlocked: true,
        reason: 'EVERYDAY_EXPENSE',
        matchedTerm: blockedTerm,
      };
    }
  }

  // 3. Checa transações puramente financeiras avulsas sem identificação de serviço
  if (
    (normalized.startsWith('pix ') || normalized.startsWith('ted ') || normalized.startsWith('doc ') || normalized.startsWith('saque ')) &&
    !normalized.includes('mensalidade') &&
    !normalized.includes('assinatura') &&
    !normalized.includes('deb aut')
  ) {
    return {
      isBlocked: true,
      reason: 'TRANSFER_OR_WITHDRAWAL',
      matchedTerm: 'transferência/saque avulso',
    };
  }

  return { isBlocked: false };
}
