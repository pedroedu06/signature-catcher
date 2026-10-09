import { FileValidationResult, SupportedFileType } from '@/lib/types/transaction';

export const SUPPORTED_EXTENSIONS: readonly SupportedFileType[] = ['csv', 'ofx', 'pdf', 'txt'] as const;

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * Formata bytes em representação amigável (B, KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const clampedIndex = Math.min(i, units.length - 1);
  const size = bytes / Math.pow(1024, clampedIndex);

  return `${size.toFixed(size >= 10 || clampedIndex === 0 ? 0 : 1)} ${units[clampedIndex]}`;
}

/**
 * Extrai a extensão do arquivo em letras minúsculas sem o ponto
 */
export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';
  const parts = filename.trim().split('.');
  if (parts.length <= 1) return '';
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Checa se uma extensão é suportada
 */
export function isSupportedFileType(extension: string): extension is SupportedFileType {
  return SUPPORTED_EXTENSIONS.includes(extension.toLowerCase() as SupportedFileType);
}

/**
 * Valida o arquivo do extrato bancário
 */
export function validateStatementFile(file: { name: string; size: number }): FileValidationResult {
  const fileName = file.name || 'Arquivo desconhecido';
  const fileSize = file.size ?? 0;
  const fileSizeFormatted = formatFileSize(fileSize);

  // 1. Validação de tamanho zero
  if (fileSize === 0) {
    return {
      isValid: false,
      fileName,
      fileSize,
      fileSizeFormatted,
      errorMessage: 'O arquivo selecionado está vazio (0 bytes).',
    };
  }

  // 2. Validação de tamanho máximo
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      fileName,
      fileSize,
      fileSizeFormatted,
      errorMessage: `O arquivo excede o limite máximo permitido de ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`,
    };
  }

  // 3. Validação de extensão
  const extension = getFileExtension(fileName);
  if (!isSupportedFileType(extension)) {
    return {
      isValid: false,
      fileName,
      fileSize,
      fileSizeFormatted,
      errorMessage: `Formato de arquivo não suportado (.${extension || 'sem extensão'}). Formatos aceitos: .CSV, .OFX, .PDF e .TXT.`,
    };
  }

  return {
    isValid: true,
    fileType: extension,
    fileName,
    fileSize,
    fileSizeFormatted,
  };
}

/**
 * Extrai as primeiras N linhas não vazias de um texto para prévia
 */
export function extractPreviewLines(content: string, maxLines = 5): string[] {
  if (!content) return [];
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, maxLines);
}
