import { describe, it, expect } from 'vitest';
import { detectSubscriptions } from '@/lib/engine/detector';
import { parseCSVStatement } from '@/lib/parsers/csv-parser';
import { MOCK_NUBANK_CSV, MOCK_ITAU_CSV } from '@/lib/fixtures/mock-statements';
import { RawTransaction } from '@/lib/types/transaction';

describe('Motor de Detecção e Limpeza (detector)', () => {
  it('deve descartar lanchonetes, padarias, mercados e restaurantes mesmo frequentes', () => {
    const raw: RawTransaction[] = [
      { id: '1', date: '2026-03-01', description: 'Lanchonete Bom Sabor', amount: 25.0, type: 'DEBIT' },
      { id: '2', date: '2026-03-05', description: 'Padaria Estrela de Belém', amount: 18.5, type: 'DEBIT' },
      { id: '3', date: '2026-03-10', description: 'Supermercado Extra', amount: 350.0, type: 'DEBIT' },
      { id: '4', date: '2026-03-15', description: 'Burger King Shopping', amount: 42.0, type: 'DEBIT' },
      { id: '5', date: '2026-03-20', description: 'Drogasil Farmacia', amount: 89.0, type: 'DEBIT' },
      { id: '6', date: '2026-03-25', description: 'Posto Shell Gasolina', amount: 150.0, type: 'DEBIT' },
    ];

    const result = detectSubscriptions(raw);
    expect(result.subscriptions.length).toBe(0);
    expect(result.discarded.length).toBe(6);
    expect(result.discarded.every((d) => d.reason.includes('Gasto cotidiano') || d.reason.includes('alimentação'))).toBe(true);
  });

  it('deve descartar compras parceladas pontuais (ex: 01/10 ou parc)', () => {
    const raw: RawTransaction[] = [
      { id: '1', date: '2026-03-01', description: 'Magazine Luiza 01/10', amount: 120.0, type: 'DEBIT' },
      { id: '2', date: '2026-03-02', description: 'Fast Shop Parc 3', amount: 250.0, type: 'DEBIT' },
    ];

    const result = detectSubscriptions(raw);
    expect(result.subscriptions.length).toBe(0);
    expect(result.discarded.length).toBe(2);
    expect(result.discarded[0].reason).toContain('Compra parcelada');
  });

  it('deve detectar corretamente assinaturas de telefonia, streaming, jogos e IA', () => {
    const raw: RawTransaction[] = [
      { id: '1', date: '2026-03-01', description: 'Claro Fibra Internet', amount: 129.9, type: 'DEBIT' },
      { id: '2', date: '2026-03-02', description: 'Netflix.com', amount: 55.9, type: 'DEBIT' },
      { id: '3', date: '2026-03-03', description: 'Spotify Brasil', amount: 34.9, type: 'DEBIT' },
      { id: '4', date: '2026-03-04', description: 'Microsoft *Xbox Game Pass', amount: 49.9, type: 'DEBIT' },
      { id: '5', date: '2026-03-05', description: 'OpenAI *ChatGPT Plus', amount: 120.0, type: 'DEBIT' },
      { id: '6', date: '2026-03-06', description: 'Smart Fit Mensalidade', amount: 119.9, type: 'DEBIT' },
    ];

    const result = detectSubscriptions(raw);
    expect(result.subscriptions.length).toBe(6);
    expect(result.discarded.length).toBe(0);

    expect(result.subscriptions.find((s) => s.name.includes('Claro'))?.category).toBe('TELECOM_UTILITIES');
    expect(result.subscriptions.find((s) => s.name.includes('Netflix'))?.category).toBe('STREAMING_VIDEO');
    expect(result.subscriptions.find((s) => s.name.includes('Spotify'))?.category).toBe('STREAMING_AUDIO');
    expect(result.subscriptions.find((s) => s.name.includes('Xbox'))?.category).toBe('GAMES');
    expect(result.subscriptions.find((s) => s.name.includes('OpenAI'))?.category).toBe('IA_PRODUCTIVITY');
    expect(result.subscriptions.find((s) => s.name.includes('Smart Fit'))?.category).toBe('HEALTH_FITNESS');
  });

  it('deve processar o extrato MOCK_NUBANK_CSV isolando exatamente as assinaturas reais', () => {
    const transactions = parseCSVStatement(MOCK_NUBANK_CSV);
    const result = detectSubscriptions(transactions);

    // No Nubank mock:
    // Assinaturas esperadas:
    // Netflix (55.90), Spotify (34.90), ChatGPT (120.00), Amazon Prime (19.90),
    // Smart Fit (119.90), Google One (9.90), iCloud (14.90), GitHub Pro (28.00), Disney Plus (43.90) = 9
    // Descartadas:
    // Pao de Acucar, Uber, Restaurante, Drogaria, Posto Shell, iFood = 6
    expect(result.subscriptions.length).toBe(9);
    expect(result.discarded.length).toBe(6);

    const subNames = result.subscriptions.map((s) => s.name);
    expect(subNames).toContain('Netflix');
    expect(subNames).toContain('Spotify');
    expect(subNames).toContain('OpenAI (ChatGPT Plus)');
    expect(subNames).toContain('Amazon Prime');
    expect(subNames).toContain('Smart Fit');
  });

  it('deve processar o extrato MOCK_ITAU_CSV isolando as assinaturas e descartando mercado e padaria', () => {
    const transactions = parseCSVStatement(MOCK_ITAU_CSV);
    const result = detectSubscriptions(transactions);

    // No Itaú mock:
    // Assinaturas esperadas:
    // DEB NETFLIX COM, DEB SPOTIFY MEN, DEB AUT CLARO FIBRA, DEB ACADEMIA SMART FIT, DEB YOUTUBE PREMIUM = 5
    // Descartadas: PIX ENVIADO MERCADO, COMPRA CARTAO PADARIA = 2
    expect(result.subscriptions.length).toBe(5);
    expect(result.discarded.length).toBe(2);
  });
});
