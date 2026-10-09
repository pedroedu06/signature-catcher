import { SubscriptionCategory } from '@/lib/types/transaction';

export interface KnownSubscription {
  name: string;
  category: SubscriptionCategory;
  keywords: string[];
}

export const KNOWN_SUBSCRIPTIONS: KnownSubscription[] = [
  // Telefonia, Celular & Internet
  {
    name: 'Claro (Móvel / Fibra)',
    category: 'TELECOM_UTILITIES',
    keywords: ['claro', 'net combo', 'claro fibra', 'claro movel', 'claro nxt', 'claro brasil'],
  },
  {
    name: 'Vivo (Móvel / Fibra)',
    category: 'TELECOM_UTILITIES',
    keywords: ['vivo', 'telefonica', 'vivo fibra', 'vivo movel', 'vivo pos', 'vivo controle'],
  },
  {
    name: 'TIM (Móvel / UltraFibra)',
    category: 'TELECOM_UTILITIES',
    keywords: ['tim brasil', 'tim celular', 'tim live', 'tim fibra', 'tim controle', 'tim black'],
  },
  {
    name: 'Oi / Oi Fibra',
    category: 'TELECOM_UTILITIES',
    keywords: ['oi fibra', 'oi telefonia', 'oi fixo'],
  },
  {
    name: 'Starlink Internet',
    category: 'TELECOM_UTILITIES',
    keywords: ['starlink', 'spacex'],
  },

  // Streaming de Vídeo
  {
    name: 'Netflix',
    category: 'STREAMING_VIDEO',
    keywords: ['netflix', 'netflix.com', 'deb netflix'],
  },
  {
    name: 'Amazon Prime',
    category: 'STREAMING_VIDEO',
    keywords: ['amazon prime', 'prime video', 'amzn prime'],
  },
  {
    name: 'Disney Plus',
    category: 'STREAMING_VIDEO',
    keywords: ['disney plus', 'disney+', 'disneyplus', 'disney media'],
  },
  {
    name: 'Max (HBO)',
    category: 'STREAMING_VIDEO',
    keywords: ['max', 'hbo max', 'hbomax', 'warner media'],
  },
  {
    name: 'Globoplay',
    category: 'STREAMING_VIDEO',
    keywords: ['globoplay', 'globo com'],
  },
  {
    name: 'Apple TV+',
    category: 'STREAMING_VIDEO',
    keywords: ['apple tv', 'apple.com/bill tv'],
  },
  {
    name: 'Paramount+',
    category: 'STREAMING_VIDEO',
    keywords: ['paramount', 'paramount+'],
  },
  {
    name: 'Crunchyroll',
    category: 'STREAMING_VIDEO',
    keywords: ['crunchyroll'],
  },

  // Streaming de Áudio
  {
    name: 'Spotify',
    category: 'STREAMING_AUDIO',
    keywords: ['spotify', 'spotify brasil', 'deb spotify'],
  },
  {
    name: 'YouTube Premium',
    category: 'STREAMING_AUDIO',
    keywords: ['youtube premium', 'youtube music', 'google *youtube'],
  },
  {
    name: 'Deezer',
    category: 'STREAMING_AUDIO',
    keywords: ['deezer'],
  },
  {
    name: 'Apple Music',
    category: 'STREAMING_AUDIO',
    keywords: ['apple music', 'apple.com/bill music'],
  },
  {
    name: 'Tidal',
    category: 'STREAMING_AUDIO',
    keywords: ['tidal'],
  },

  // Jogos & Games
  {
    name: 'Xbox Game Pass',
    category: 'GAMES',
    keywords: ['xbox', 'game pass', 'gamepass', 'microsoft *xbox'],
  },
  {
    name: 'PlayStation Plus',
    category: 'GAMES',
    keywords: ['playstation', 'ps plus', 'psn', 'sony playstation'],
  },
  {
    name: 'Nintendo Switch Online',
    category: 'GAMES',
    keywords: ['nintendo', 'nintendo online'],
  },
  {
    name: 'EA Play',
    category: 'GAMES',
    keywords: ['ea play', 'electronic arts'],
  },
  {
    name: 'Ubisoft+',
    category: 'GAMES',
    keywords: ['ubisoft', 'ubisoft+'],
  },

  // IA, Software & Produtividade
  {
    name: 'OpenAI (ChatGPT Plus)',
    category: 'IA_PRODUCTIVITY',
    keywords: ['openai', 'chatgpt', 'chat gpt'],
  },
  {
    name: 'Anthropic (Claude Pro)',
    category: 'IA_PRODUCTIVITY',
    keywords: ['anthropic', 'claude pro', 'claude.ai'],
  },
  {
    name: 'GitHub (Pro / Copilot)',
    category: 'IA_PRODUCTIVITY',
    keywords: ['github', 'copilot'],
  },
  {
    name: 'Midjourney',
    category: 'IA_PRODUCTIVITY',
    keywords: ['midjourney'],
  },
  {
    name: 'Canva Pro',
    category: 'IA_PRODUCTIVITY',
    keywords: ['canva'],
  },
  {
    name: 'Notion',
    category: 'IA_PRODUCTIVITY',
    keywords: ['notion'],
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'IA_PRODUCTIVITY',
    keywords: ['adobe', 'creative cloud', 'photoshop'],
  },
  {
    name: 'Microsoft 365',
    category: 'IA_PRODUCTIVITY',
    keywords: ['microsoft 365', 'msft *365', 'office 365'],
  },

  // Cloud & Armazenamento
  {
    name: 'Google One / Drive Storage',
    category: 'CLOUD_INFRA',
    keywords: ['google one', 'google storage', 'google *cloud'],
  },
  {
    name: 'Apple iCloud',
    category: 'CLOUD_INFRA',
    keywords: ['icloud', 'apple.com/bill icloud', 'apple.com/bill'],
  },
  {
    name: 'Dropbox',
    category: 'CLOUD_INFRA',
    keywords: ['dropbox'],
  },

  // Saúde, Fitness & Academias
  {
    name: 'Smart Fit',
    category: 'HEALTH_FITNESS',
    keywords: ['smart fit', 'smartfit', 'academia smart fit'],
  },
  {
    name: 'Bluefit',
    category: 'HEALTH_FITNESS',
    keywords: ['bluefit', 'academia bluefit'],
  },
  {
    name: 'TotalPass',
    category: 'HEALTH_FITNESS',
    keywords: ['totalpass', 'total pass'],
  },
  {
    name: 'Gympass / Wellhub',
    category: 'HEALTH_FITNESS',
    keywords: ['gympass', 'wellhub'],
  },
  {
    name: 'Panobianco Academia',
    category: 'HEALTH_FITNESS',
    keywords: ['panobianco'],
  },

  // Educação & Idiomas
  {
    name: 'Duolingo Super',
    category: 'EDUCATION',
    keywords: ['duolingo'],
  },
  {
    name: 'Alura',
    category: 'EDUCATION',
    keywords: ['alura'],
  },
];

/**
 * Termos genéricos de recorrência que indicam assinatura
 */
export const GENERIC_RECURRING_KEYWORDS = [
  'assinatura',
  'mensalidade',
  'plano mensal',
  'recorrente',
  'deb aut',
  'debito automatico',
  'fatura mensal',
  'membership',
  'subscription',
];
