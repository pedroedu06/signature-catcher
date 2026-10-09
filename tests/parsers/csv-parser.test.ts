import { describe, it, expect } from 'vitest';
import {
  parseCSVStatement,
  detectDelimiter,
  parseCurrencyAmount,
  parseTransactionDate,
} from '@/lib/parsers/csv-parser';
import { MOCK_NUBANK_CSV, MOCK_ITAU_CSV } from '@/lib/fixtures/mock-statements';

describe('CSV Parser (csv-parser)', () => {
  describe('detectDelimiter', () => {
    it('deve detectar vírgula para CSVs padrão', () => {
      expect(detectDelimiter('data,titulo,valor')).toBe(',');
    });

    it('deve detectar ponto e vírgula para CSVs padrão brasileiro (Itaú)', () => {
      expect(detectDelimiter('Data;Lancamento;Valor;Saldo')).toBe(';');
    });

    it('deve detectar tabulação para TSVs', () => {
      expect(detectDelimiter('Data\tDescricao\tValor')).toBe('\t');
    });
  });

  describe('parseCurrencyAmount', () => {
    it('deve converter valores brasileiros com vírgula corretamente', () => {
      expect(parseCurrencyAmount('-55,90').amount).toBe(55.9);
      expect(parseCurrencyAmount('119,90').amount).toBe(119.9);
      expect(parseCurrencyAmount('R$ 1.250,00').amount).toBe(1250);
    });

    it('deve converter valores internacionais com ponto', () => {
      expect(parseCurrencyAmount('55.90').amount).toBe(55.9);
      expect(parseCurrencyAmount('-120.00').amount).toBe(120);
    });
  });

  describe('parseTransactionDate', () => {
    it('deve normalizar DD/MM/YYYY para YYYY-MM-DD', () => {
      expect(parseTransactionDate('01/03/2026')).toBe('2026-03-01');
      expect(parseTransactionDate('15/12/2025')).toBe('2025-12-15');
    });

    it('deve manter datas já no formato YYYY-MM-DD', () => {
      expect(parseTransactionDate('2026-03-01')).toBe('2026-03-01');
    });
  });

  describe('parseCSVStatement com Mocks Reais', () => {
    it('deve parsear o extrato Nubank com 15 transações', () => {
      const transactions = parseCSVStatement(MOCK_NUBANK_CSV);
      expect(transactions.length).toBe(15);

      const first = transactions[0];
      expect(first.date).toBe('2026-03-01');
      expect(first.description).toBe('Netflix Entretenimento');
      expect(first.amount).toBe(55.9);
    });

    it('deve parsear o extrato Itaú delimitado por ponto e vírgula', () => {
      const transactions = parseCSVStatement(MOCK_ITAU_CSV);
      expect(transactions.length).toBe(7);

      const netflix = transactions[0];
      expect(netflix.date).toBe('2026-03-01');
      expect(netflix.description).toBe('DEB NETFLIX COM');
      expect(netflix.amount).toBe(55.9);
    });

    it('deve retornar array vazio para conteúdo em branco ou inválido', () => {
      expect(parseCSVStatement('')).toEqual([]);
      expect(parseCSVStatement('Apenas uma linha')).toEqual([]);
    });
  });
});
