import { RawTransaction, SubscriptionItem, SubscriptionCategory } from '@/lib/types/transaction';
import { normalizeText } from '@/lib/parsers/csv-parser';
import { checkBlocklist } from '@/lib/engine/blocklist';
import { KNOWN_SUBSCRIPTIONS, GENERIC_RECURRING_KEYWORDS } from '@/lib/engine/dictionary';

export interface DiscardedTransaction {
  transaction: RawTransaction;
  reason: string;
}

export interface DetectionResult {
  subscriptions: SubscriptionItem[];
  discarded: DiscardedTransaction[];
  totalAnalyzed: number;
}

/**
 * Analisa as transações e detecta somente assinaturas reais,
 * descartando gastos cotidianos (lanchonetes, mercados, padarias) e compras parceladas.
 */
export function detectSubscriptions(transactions: RawTransaction[]): DetectionResult {
  const subscriptions: SubscriptionItem[] = [];
  const discarded: DiscardedTransaction[] = [];

  for (const tx of transactions) {
    const normalized = normalizeText(tx.description);

    // 1. Filtrar transações com valor <= 0
    if (tx.amount <= 0) {
      discarded.push({
        transaction: tx,
        reason: 'Valor zerado ou inválido',
      });
      continue;
    }

    // 2. Verificar Lista Negra (Lanchonetes, Padarias, Mercados, Compras Parceladas)
    const blockCheck = checkBlocklist(tx.description);
    if (blockCheck.isBlocked) {
      let reasonText = 'Estabelecimento cotidiano (não é assinatura)';
      if (blockCheck.reason === 'INSTALLMENT') {
        reasonText = `Compra parcelada (${blockCheck.matchedTerm})`;
      } else if (blockCheck.reason === 'EVERYDAY_EXPENSE') {
        reasonText = `Gasto cotidiano/alimentação (${blockCheck.matchedTerm})`;
      } else if (blockCheck.reason === 'TRANSFER_OR_WITHDRAWAL') {
        reasonText = `Transferência ou saque avulso`;
      }

      discarded.push({
        transaction: tx,
        reason: reasonText,
      });
      continue;
    }

    // 3. Cruzar com o catálogo de serviços conhecidos
    let matchedService = null;
    let matchedKeyword = '';

    for (const service of KNOWN_SUBSCRIPTIONS) {
      for (const keyword of service.keywords) {
        if (normalized.includes(keyword)) {
          matchedService = service;
          matchedKeyword = keyword;
          break;
        }
      }
      if (matchedService) break;
    }

    if (matchedService) {
      subscriptions.push({
        id: `sub-${tx.id}`,
        transactionId: tx.id,
        name: matchedService.name,
        detectedKeyword: matchedKeyword,
        category: matchedService.category,
        monthlyAmount: tx.amount,
        confidence: 0.95,
        date: tx.date,
        originalDescription: tx.description,
        isActive: true,
      });
      continue;
    }

    // 4. Cruzar com termos genéricos de recorrência (ex: "mensalidade escola", "plano mensal")
    const genericMatch = GENERIC_RECURRING_KEYWORDS.find((term) => normalized.includes(term));
    if (genericMatch) {
      subscriptions.push({
        id: `sub-${tx.id}`,
        transactionId: tx.id,
        name: tx.description,
        detectedKeyword: genericMatch,
        category: 'OTHER',
        monthlyAmount: tx.amount,
        confidence: 0.8,
        date: tx.date,
        originalDescription: tx.description,
        isActive: true,
      });
      continue;
    }

    // 5. Se não correspondeu a nenhuma assinatura, descartar como compra comum
    discarded.push({
      transaction: tx,
      reason: 'Compra avulsa comum não catalogada',
    });
  }

  return {
    subscriptions,
    discarded,
    totalAnalyzed: transactions.length,
  };
}
