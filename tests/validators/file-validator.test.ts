import { describe, it, expect } from 'vitest';
import {
  validateStatementFile,
  formatFileSize,
  getFileExtension,
  isSupportedFileType,
  extractPreviewLines,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/validators/file-validator';

describe('Validador de Arquivos (file-validator)', () => {
  describe('getFileExtension', () => {
    it('deve extrair a extensão em minúsculas corretamente', () => {
      expect(getFileExtension('extrato.csv')).toBe('csv');
      expect(getFileExtension('FATURA.CSV')).toBe('csv');
      expect(getFileExtension('banco.inter.ofx')).toBe('ofx');
      expect(getFileExtension('documento.PDF')).toBe('pdf');
      expect(getFileExtension('notas.txt')).toBe('txt');
    });

    it('deve retornar string vazia para arquivos sem extensão ou inválidos', () => {
      expect(getFileExtension('extrato_sem_extensao')).toBe('');
      expect(getFileExtension('')).toBe('');
    });
  });

  describe('isSupportedFileType', () => {
    it('deve aceitar os formatos csv, ofx, pdf e txt', () => {
      expect(isSupportedFileType('csv')).toBe(true);
      expect(isSupportedFileType('CSV')).toBe(true);
      expect(isSupportedFileType('ofx')).toBe(true);
      expect(isSupportedFileType('pdf')).toBe(true);
      expect(isSupportedFileType('txt')).toBe(true);
    });

    it('deve rejeitar outros formatos', () => {
      expect(isSupportedFileType('xlsx')).toBe(false);
      expect(isSupportedFileType('png')).toBe(false);
      expect(isSupportedFileType('exe')).toBe(false);
      expect(isSupportedFileType('json')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('deve formatar bytes corretamente em unidades legíveis', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(20480)).toBe('20 KB');
      expect(formatFileSize(1048576)).toBe('1.0 MB');
      expect(formatFileSize(5242880)).toBe('5.0 MB');
    });
  });

  describe('validateStatementFile', () => {
    it('deve validar com sucesso um arquivo .csv válido', () => {
      const result = validateStatementFile({
        name: 'extrato_nubank.csv',
        size: 15420,
      });

      expect(result.isValid).toBe(true);
      expect(result.fileType).toBe('csv');
      expect(result.fileName).toBe('extrato_nubank.csv');
      expect(result.fileSizeFormatted).toBe('15 KB');
      expect(result.errorMessage).toBeUndefined();
    });

    it('deve validar com sucesso arquivos em maiúsculo (ex: .CSV, .OFX, .PDF)', () => {
      const csvResult = validateStatementFile({ name: 'FATURA_ITAU.CSV', size: 8192 });
      expect(csvResult.isValid).toBe(true);
      expect(csvResult.fileType).toBe('csv');

      const ofxResult = validateStatementFile({ name: 'EXTRATO.OFX', size: 10240 });
      expect(ofxResult.isValid).toBe(true);
      expect(ofxResult.fileType).toBe('ofx');

      const pdfResult = validateStatementFile({ name: 'COMPROVANTE.PDF', size: 1048576 });
      expect(pdfResult.isValid).toBe(true);
      expect(pdfResult.fileType).toBe('pdf');
    });

    it('deve rejeitar arquivo com tamanho 0 (vazio)', () => {
      const result = validateStatementFile({
        name: 'extrato_vazio.csv',
        size: 0,
      });

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('vazio (0 bytes)');
    });

    it('deve rejeitar arquivo que exceda o limite máximo de 20MB', () => {
      const result = validateStatementFile({
        name: 'arquivo_gigante.csv',
        size: MAX_FILE_SIZE_BYTES + 1024,
      });

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('excede o limite máximo permitido');
    });

    it('deve rejeitar extensões não suportadas com mensagem amigável', () => {
      const pngResult = validateStatementFile({ name: 'foto_cartao.png', size: 50000 });
      expect(pngResult.isValid).toBe(false);
      expect(pngResult.errorMessage).toContain('Formato de arquivo não suportado (.png)');

      const exeResult = validateStatementFile({ name: 'instalador.exe', size: 100000 });
      expect(exeResult.isValid).toBe(false);
      expect(exeResult.errorMessage).toContain('Formato de arquivo não suportado (.exe)');
    });
  });

  describe('extractPreviewLines', () => {
    it('deve extrair as primeiras linhas ignorando linhas em branco', () => {
      const rawText = `
        Data,Descricao,Valor
        2026-03-01,Netflix,55.90
        
        2026-03-02,Spotify,34.90
        2026-03-05,Padaria,15.00
        2026-03-07,Amazon Prime,19.90
        2026-03-10,Internet Fibra,120.00
      `;

      const lines = extractPreviewLines(rawText, 3);
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('Data,Descricao,Valor');
      expect(lines[1]).toBe('2026-03-01,Netflix,55.90');
      expect(lines[2]).toBe('2026-03-02,Spotify,34.90');
    });

    it('deve lidar com conteúdo vazio sem erros', () => {
      expect(extractPreviewLines('')).toEqual([]);
    });
  });
});
