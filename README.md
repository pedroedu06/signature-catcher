# 💳 Assinatura Catcher (Signature Catcher)

> **Verificador inteligente de assinaturas e gastos recorrentes a partir de extratos bancários.**

O **Assinatura Catcher** é uma aplicação web moderna e stateless desenvolvida para ajudar você a descobrir exatamente quanto gasta por mês em assinaturas (Netflix, Spotify, ChatGPT, Smart Fit, iCloud, etc.). 

Você simplesmente insere seu extrato bancário (OFX, CSV ou texto colado), a pipeline processa as transações, identifica as cobranças recorrentes e apresenta um resumo financeiro com projeção anual, divisão por categoria e opção de exportação.

---

## 🚀 Tecnologias Utilizadas

- **Framework Web:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Frontend e Pipeline)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Testes Automatizados:** [Vitest](https://vitest.dev/)
- **Gerenciador de Pacotes:** [Bun](https://bun.sh/) (ou npm / pnpm / yarn)

---

## 📦 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Bun** (versão 1.3+ recomendada) ou **Node.js** (versão 20+ ou 24+)

Para verificar as versões:
```bash
bun -v
# ou
node -v && npm -v
```

---

## 🛠️ Como Iniciar o Projeto Localmente

### 1. Clonar ou navegar até a pasta do projeto
```bash
cd D:\projetos\assinatura_catcher\signature-catcher
```

### 2. Instalar as dependências
Se estiver utilizando **Bun**:
```bash
bun install
```
*(Se preferir npm: `npm install`)*

### 3. Rodar o servidor de desenvolvimento
```bash
bun dev
```
*(Se preferir npm: `npm run dev`)*

Abra o seu navegador e acerte em:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Como Rodar os Testes Automatizados

A suíte de testes unitários é executada com **Vitest**, garantindo agilidade e validação dos parsers e do algoritmo de classificação.

### Executar todos os testes uma vez:
```bash
bun test
# ou via script npm:
bun run test
# ou com npm:
npm test
```

### Executar os testes em modo contínuo (Watch Mode):
```bash
bun run test:watch
# ou com npm:
npm run test:watch
```

---

## 🏗️ Build de Produção

Para validar a compilação e gerar o build otimizado:
```bash
bun run build
# ou
npm run build
```

Para iniciar o servidor de produção localmente após o build:
```bash
bun run start
# ou
npm start
```

---

## 📁 Estrutura do Projeto

```
signature-catcher/
├── app/                  # Rotas e páginas do Next.js (App Router)
│   ├── globals.css       # Estilos globais e Tailwind CSS
│   ├── layout.tsx        # Layout principal da aplicação
│   └── page.tsx          # Página principal do fluxo da aplicação
├── components/           # Componentes modulares da interface
│   ├── StatementUploader # Upload de arquivos (OFX, CSV) e colagem de texto
│   ├── ReviewTable       # Tabela interativa para marcar/desmarcar assinaturas
│   ├── FinancialSummary  # Painel de métricas (total mensal, anual, categorias)
│   └── MockDataSelector  # Botões para testar com 1 clique (Nubank, Itaú, etc.)
├── lib/
│   ├── types/            # Interfaces TypeScript (transações, categorias, resumo)
│   ├── parsers/          # Parsers dedicados para OFX, CSV e Texto
│   ├── engine/           # Dicionário de serviços, motor de detecção e cálculos
│   └── fixtures/         # Extratos bancários simulados para testes rápidos
├── tests/                # Testes unitários com Vitest
│   ├── sanity.test.ts    # Teste de fumaça e resolução de path aliases
│   ├── parsers/          # Testes para validação dos parsers de extrato
│   └── engine/           # Testes das regras de classificação e cálculo
├── vitest.config.mts     # Configuração do Vitest
├── tsconfig.json         # Configurações do compilador TypeScript
└── package.json          # Scripts e dependências do projeto
```

---

## 🔒 Privacidade e Segurança

- **100% Client/Local First:** O processamento do extrato bancário acontece localmente na sua máquina.
- **Zero Persistência Externa:** Nenhum dado financeiro ou transação é salvo em bancos de dados em nuvem ou enviado para serviços terceiros.
