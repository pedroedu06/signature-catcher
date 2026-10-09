/**
 * Tipagens fundamentais para o Assinatura Catcher / Signature Catcher
 */

export type TransactionType = 'DEBIT' | 'CREDIT' | 'OTHER';

export type SupportedFileType = 'csv' | 'ofx' | 'pdf' | 'txt';

export interface FileValidationResult {
  isValid: boolean;
  fileType?: SupportedFileType;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  errorMessage?: string;
  rawContent?: string;
}

export interface UploadedFileState {
  file: File | { name: string; size: number; content?: string };
  validation: FileValidationResult;
  previewLines?: string[];
}

export type SubscriptionCategory =
  | 'STREAMING_VIDEO'
  | 'STREAMING_AUDIO'
  | 'IA_PRODUCTIVITY'
  | 'CLOUD_INFRA'
  | 'HEALTH_FITNESS'
  | 'GAMES'
  | 'EDUCATION'
  | 'TELECOM_UTILITIES'
  | 'OTHER';

export interface RawTransaction {
  id: string;
  date: string; // Formato YYYY-MM-DD
  description: string;
  amount: number; // Valor positivo para saídas/cobranças em BRL
  type: TransactionType;
  fitid?: string; // ID único se fornecido pelo OFX
  category?: string;
  rawText?: string;
}

export interface SubscriptionItem {
  id: string;
  transactionId: string;
  name: string; // Ex: "Netflix", "Spotify"
  detectedKeyword: string;
  category: SubscriptionCategory;
  monthlyAmount: number; // Valor mensal em BRL
  confidence: number; // 0 a 1 (ex: 0.95)
  date: string;
  originalDescription: string;
  isActive: boolean; // Controlado pelo usuário na etapa de revisão
}

export interface FinancialSummary {
  totalMonthlySpend: number;
  annualProjectedSpend: number;
  totalStatementSpend: number;
  subscriptionSharePercentage: number;
  subscriptionsCount: number;
  categoryBreakdown: {
    category: SubscriptionCategory;
    label: string;
    total: number;
    count: number;
    percentage: number;
  }[];
}
