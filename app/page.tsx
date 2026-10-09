'use client';

import React, { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { UploadedFileState } from '@/lib/types/transaction';

export default function Home() {
  const [currentFileState, setCurrentFileState] = useState<UploadedFileState | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Topbar / Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              💳
            </div>
            <div className="flex items-center">
              <span className="font-bold text-base tracking-tight">Assinatura Catcher</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                v0.1.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Descubra quanto você paga em <span className="text-emerald-600 dark:text-emerald-400">assinaturas</span> por mês
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Arraste seu extrato bancário em <strong className="text-neutral-800 dark:text-neutral-200">.CSV</strong> (ou .OFX, .PDF) e visualize suas cobranças recorrentes sem cadastros e sem salvar dados na nuvem.
          </p>
        </div>

        {/* Pipeline Step Progress */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto text-xs font-semibold">
          <div className={`p-3 rounded-xl border text-center transition ${
            currentFileState 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
              : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
          }`}>
            <span className="block text-sm font-bold">Passo 1</span>
            Entrada do Arquivo
          </div>
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/40 text-neutral-400 dark:text-neutral-500 text-center">
            <span className="block text-sm font-bold">Passo 2</span>
            Limpeza & Detecção
          </div>
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/40 text-neutral-400 dark:text-neutral-500 text-center">
            <span className="block text-sm font-bold">Passo 3</span>
            Cálculo & Resumo
          </div>
        </div>

        {/* Upload Component */}
        <section className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <FileUploader
            onFileAccepted={(state) => setCurrentFileState(state)}
            onFileRemoved={() => setCurrentFileState(null)}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500">
        Assinatura Catcher • Verificador Inteligente de Gastos Mensais
      </footer>
    </div>
  );
}
