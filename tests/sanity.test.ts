import { describe, it, expect } from 'vitest';

describe('Ambiente de Testes - Sanity Check', () => {
  it('deve executar asserções matemáticas básicas com sucesso', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve suportar asserções assíncronas', async () => {
    const calcularMensalidade = async (valor: number) => valor * 12;
    await expect(calcularMensalidade(50)).resolves.toBe(600);
  });

  it('deve importar tipos e módulos utilizando o path alias @/*', async () => {
    const { type }: { type: import('@/lib/types/transaction').TransactionType } = {
      type: 'DEBIT',
    };
    expect(type).toBe('DEBIT');
  });
});
