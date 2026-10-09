'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadedFileState } from '@/lib/types/transaction';
import {
  validateStatementFile,
  extractPreviewLines,
  formatFileSize,
} from '@/lib/validators/file-validator';
import { MOCK_NUBANK_CSV, MOCK_ITAU_CSV } from '@/lib/fixtures/mock-statements';

interface FileUploaderProps {
  onFileAccepted?: (state: UploadedFileState) => void;
  onFileRemoved?: () => void;
}

export function FileUploader({ onFileAccepted, onFileRemoved }: FileUploaderProps) {
  const [uploadedState, setUploadedState] = useState<UploadedFileState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);

    const validation = validateStatementFile({
      name: file.name,
      size: file.size,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Arquivo inválido.');
      return;
    }

    try {
      // Para arquivos de texto (CSV, OFX, TXT), ler o conteúdo para prévia
      if (validation.fileType !== 'pdf') {
        const textContent = await file.text();
        const previewLines = extractPreviewLines(textContent, 5);

        const state: UploadedFileState = {
          file,
          validation: {
            ...validation,
            rawContent: textContent,
          },
          previewLines,
        };

        setUploadedState(state);
        onFileAccepted?.(state);
      } else {
        // Para PDF (leitura binária na fase de prévia)
        const state: UploadedFileState = {
          file,
          validation,
          previewLines: ['[Arquivo PDF recebido - Pré-visualização binária]'],
        };

        setUploadedState(state);
        onFileAccepted?.(state);
      }
    } catch (err) {
      setErrorMessage('Não foi possível ler o arquivo selecionado. Tente novamente.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedState(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemoved?.();
  };

  const handleLoadMock = (type: 'nubank' | 'itau') => {
    setErrorMessage(null);
    const content = type === 'nubank' ? MOCK_NUBANK_CSV : MOCK_ITAU_CSV;
    const name = type === 'nubank' ? 'extrato_nubank_exemplo.csv' : 'extrato_itau_exemplo.csv';
    const size = new Blob([content]).size;

    const validation = validateStatementFile({ name, size });
    const previewLines = extractPreviewLines(content, 5);

    const state: UploadedFileState = {
      file: { name, size, content },
      validation: {
        ...validation,
        rawContent: content,
      },
      previewLines,
    };

    setUploadedState(state);
    onFileAccepted?.(state);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.ofx,.pdf,.txt"
        onChange={handleFileInputChange}
        className="hidden"
        id="statement-file-input"
      />

      {/* Alerta de erro */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm animate-in fade-in">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">Erro ao carregar arquivo</p>
            <p className="mt-0.5 opacity-90">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Estado: Arquivo Recebido com Sucesso */}
      {uploadedState ? (
        <div className="p-6 rounded-2xl bg-emerald-500/5 border-2 border-emerald-500/30 dark:bg-emerald-950/20 shadow-sm space-y-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                    Arquivo recebido com sucesso!
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    {uploadedState.validation.fileType}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  <span className="font-medium text-neutral-900 dark:text-neutral-200">
                    {uploadedState.validation.fileName}
                  </span>{' '}
                  • {uploadedState.validation.fileSizeFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleRemoveFile}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 bg-neutral-200/60 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition"
              >
                Trocar de arquivo
              </button>
            </div>
          </div>

          {/* Pré-visualização de linhas capturadas */}
          {uploadedState.previewLines && uploadedState.previewLines.length > 0 && (
            <div className="pt-3 border-t border-emerald-500/15">
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                <span className="font-semibold uppercase tracking-wider">Pré-visualização do conteúdo:</span>
                <span>Primeiras {uploadedState.previewLines.length} linhas</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 text-neutral-200 text-xs font-mono overflow-x-auto space-y-1">
                {uploadedState.previewLines.map((line, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-neutral-500 select-none">{idx + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs text-emerald-700 dark:text-emerald-400">
            <span>✓ Pronto para a próxima etapa (limpeza de dados e detecção de assinaturas).</span>
          </div>
        </div>
      ) : (
        /* Estado: Área de Upload (Dropzone) */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-8 sm:p-10 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-emerald-500/[0.02]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:scale-105 transition">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div>
              <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Arraste seu extrato bancário aqui ou clique para selecionar
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Formatos aceitos: <strong className="text-neutral-700 dark:text-neutral-300">.CSV</strong>, .OFX, .PDF ou .TXT (até 20MB)
              </p>
            </div>

            {/* Badges dos formatos */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                .CSV
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                .OFX
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                .PDF
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                .TXT
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botões de Teste Rápido (Mock) */}
      {!uploadedState && (
        <div className="p-4 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            Não tem um extrato em mãos agora? Teste o fluxo com 1 clique:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleLoadMock('nubank')}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xs transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Carregar Nubank .CSV (Exemplo)
            </button>
            <button
              onClick={() => handleLoadMock('itau')}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xs transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Carregar Itaú .CSV (Exemplo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
