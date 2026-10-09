'use client';

import React, { useState } from 'react';
import { SubscriptionItem, SubscriptionCategory } from '@/lib/types/transaction';
import { DiscardedTransaction } from '@/lib/engine/detector';

interface TemporaryResultsListProps {
  initialSubscriptions: SubscriptionItem[];
  discardedTransactions: DiscardedTransaction[];
  totalAnalyzed: number;
  fileName: string;
  onReset: () => void;
}

export function TemporaryResultsList({
  initialSubscriptions,
  discardedTransactions,
  totalAnalyzed,
  fileName,
  onReset,
}: TemporaryResultsListProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(initialSubscriptions);
  const [showDiscarded, setShowDiscarded] = useState(false);

  // Alterna o estado ativo de um item
  const toggleItemActive = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  // Permite resgatar uma transação descartada caso o usuário queira
  const recoverDiscardedItem = (discarded: DiscardedTransaction) => {
    const newItem: SubscriptionItem = {
      id: `sub-${discarded.transaction.id}`,
      transactionId: discarded.transaction.id,
      name: discarded.transaction.description,
      detectedKeyword: 'Recuperado manualmente',
      category: 'OTHER',
      monthlyAmount: discarded.transaction.amount,
      confidence: 1.0,
      date: discarded.transaction.date,
      originalDescription: discarded.transaction.description,
      isActive: true,
    };
    setSubscriptions((prev) => [newItem, ...prev]);
  };

  // Cálculo dinâmico do subtotal
  const activeCount = subscriptions.filter((s) => s.isActive).length;
  const currentSubtotal = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, item) => sum + item.monthlyAmount, 0);

  // Mapeamento visual das categorias
  const getCategoryBadge = (category: SubscriptionCategory) => {
    switch (category) {
      case 'STREAMING_VIDEO':
        return { label: 'Streaming Vídeo', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20' };
      case 'STREAMING_AUDIO':
        return { label: 'Streaming Música', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' };
      case 'TELECOM_UTILITIES':
        return { label: 'Telefonia / Internet', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' };
      case 'GAMES':
        return { label: 'Jogos / Games', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20' };
      case 'IA_PRODUCTIVITY':
        return { label: 'IA & Produtividade', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' };
      case 'CLOUD_INFRA':
        return { label: 'Nuvem & Storage', color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20' };
      case 'HEALTH_FITNESS':
        return { label: 'Academia & Saúde', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' };
      case 'EDUCATION':
        return { label: 'Educação / Cursos', color: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20' };
      default:
        return { label: 'Outros Recorrentes', color: 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 border-neutral-500/20' };
    }
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header do Resultado Temporário */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold tracking-tight">Lista Temporária de Assinaturas</h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
              {fileName}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Detectadas <strong>{subscriptions.length} assinaturas</strong> em um total de{' '}
            <strong>{totalAnalyzed} transações</strong> analisadas. Compras em mercados, lanchonetes e parcelamentos foram descartados.
          </p>
        </div>

        {/* Card de Subtotal Dinâmico */}
        <div className="flex items-center justify-between md:justify-end gap-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
          <div className="text-right">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 block font-medium">
              Subtotal ({activeCount} selecionadas)
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatBRL(currentSubtotal)}
              <span className="text-xs font-normal text-neutral-500 ml-1">/mês</span>
            </span>
          </div>
          <button
            onClick={onReset}
            className="px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition"
            title="Enviar outro arquivo"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela Interativa de Itens */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-xs text-neutral-500">
          <span>Marque ou desmarque para incluir ou retirar do cálculo:</span>
          <span>{activeCount} de {subscriptions.length} ativas</span>
        </div>

        {subscriptions.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <p className="text-base font-semibold">Nenhuma assinatura identificada neste arquivo.</p>
            <p className="text-xs">Verifique os itens descartados abaixo caso alguma transação não tenha sido reconhecida.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {subscriptions.map((item) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemActive(item.id)}
                  className={`p-4 sm:px-6 flex items-center justify-between gap-4 cursor-pointer transition select-none ${
                    item.isActive
                      ? 'hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40'
                      : 'opacity-40 bg-neutral-100/40 dark:bg-neutral-950/40 line-through'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={() => toggleItemActive(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                          {item.name}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {item.originalDescription} • {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                      {formatBRL(item.monthlyAmount)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">mensal</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion / Seção de Transações Descartadas */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowDiscarded(!showDiscarded)}
          className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
        >
          <div className="flex items-center gap-2">
            <span>🛡️ Ver transações descartadas pela limpeza ({discardedTransactions.length})</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              Lanchonetes, Mercados, etc.
            </span>
          </div>
          <span>{showDiscarded ? '▲ Ocultar' : '▼ Mostrar'}</span>
        </button>

        {showDiscarded && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 space-y-2 bg-neutral-50/50 dark:bg-neutral-950/30 max-h-96 overflow-y-auto">
            <p className="text-xs text-neutral-500 mb-3">
              Estas transações foram filtradas pelo motor inteligente para não sujar seu cálculo de assinaturas. Se algum item abaixo for uma assinatura real, clique em <strong>"Resgatar"</strong>.
            </p>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {discardedTransactions.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 block truncate">
                      {item.transaction.description}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {item.transaction.date} • {formatBRL(item.transaction.amount)} • Motivo:{' '}
                      <em className="text-rose-500 dark:text-rose-400 not-italic font-medium">{item.reason}</em>
                    </span>
                  </div>
                  <button
                    onClick={() => recoverDiscardedItem(item)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-neutral-200 dark:bg-neutral-800 hover:bg-emerald-500 hover:text-white rounded-md transition shrink-0"
                  >
                    + Resgatar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
