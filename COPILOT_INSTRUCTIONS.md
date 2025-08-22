# Guia Operacional e de Contexto Contínuo – LP-CHATBOT-UNIMED

## 1. Objetivo Geral do Projeto

Landing page de captação de leads B2B (planos de saúde empresariais Unimed) com:

- Conversão via chatbot guiado (qualificação progressiva)
- Persistência em backend serverless (Convex)
- Envio automático de e-mails (Resend) para leads completos ou mornos
- Rastreamento Facebook Pixel carregado sempre (PageView + futuros eventos)

Foco: rapidez, UX mobile-first, simplicidade operacional e extensibilidade para tracking e automação comercial.

## 2. Arquitetura e Pastas Principais

Raiz:

- `index.html`: Entry point. Carrega estilos, React app e Meta Pixel (init + PageView).
- `package.json`: Scripts (dev paralelo frontend/backend), build e pseudo-lint (usa tsc + build).
- `eslint.config.js` / `tsconfig.*`: Config de lint e TypeScript.
- `tailwind.config.js` / `postcss.config.cjs` / `src/index.css`: Stack de estilos (Tailwind).
- Documentação auxiliar: `GUIA-*`, `IMPLEMENTACAO-*`, `CHECKLIST-*` (não são fonte de verdade se divergirem do código atual).

Backend (`convex/`):

- `schema.ts`: Define tabela `leads`.
- `leads.ts`: mutations `createLead`, `updateLead` + query `getLead`.
- `email.ts`: action `sendLeadEmail` (Resend + BrasilAPI para CNPJ).
- Infra: `auth.ts`, `router.ts`, `http.ts` (suporte Convex/Auth).

Frontend (`src/`):

- `main.tsx` / `App.tsx`: Bootstrap + rotas.
- `hooks/useFacebookPixel.ts`: Hook utilitário (usa fbq global; não injeta script).
- `components/**`: Landing page e chatbot (
  - Chatbot: `Chatbot.tsx` + `ChatbotHeader`, `ChatbotMessages`, `ChatbotInput`, `ChatbotFinalCTA`.
  - Página de chat full: `ChatPage.tsx`.
  - Banner: `CookieConsent.tsx` (informativo).
  - Outras seções de marketing.
)
- `lib/utils.ts`: utilidades (expandir para formatações futuras).

## 3. Tecnologias / Stack

Frontend: React 19, Vite, Tailwind, Lucide, sonner.

Backend: Convex (functions serverless), Resend (e-mail).

Infra: TypeScript ~5.7, ESLint 9, Facebook Pixel, BrasilAPI (CNPJ).

## 4. Fluxo do Lead

1. PageView registrado (Pixel).
2. Chat inicia: pergunta nome → WhatsApp → (plano atual?) → nome/valor plano → dificuldade → idades → CNPJ (opcional) → finalizado.
3. Após WhatsApp: cria lead (email sintético derivado do número).
4. Cada passo: `updateLead` incremental.
5. Final: atualização + envio e-mail lead completo.
6. Fechamento antes do final: envia e-mail morno (`isWarmLead`).

## 5. Estados e Campos

Tabela `leads` (principais):

- `nome`, `whatsapp`, `email`, `temCnpj`, `numeroCnpj?`, `temPlanoAtual?`, `nomePlanoAtual?`, `valorPlanoAtual?`, `maiorDificuldade?`, `idadesBeneficiarios?`, `cidade?`, `estado?`, `dadosEmpresa?`, `status`.

Status: `em_andamento` | `completo` | `enviado` | `morno_enviado` | `erro_email`.

Chatbot state: `step`, `input`, `leadId`, `chatData` (parcial), `messages`, `isTyping`.

## 6. Padrões de Código

- Componentes: funcionais, hooks, PascalCase.
- Tipos: Interfaces para domínios (`ChatData`, `Message`).
- Mutations Convex: argumentos validados com `v.*`.
- Logs com prefixos consistentes: `[createLead]`, `[updateLead]`, `[sendLeadEmail]`, `[Chatbot Close]`.
- Erros: `try/catch` detalhado no backend + toast no frontend.
- Formatação de entrada (telefone, CNPJ, moeda) centralizada em `handleInputChange` (extrair futuramente para utils).
- Pixel: não reinicializar; usar `if (window.fbq)` antes de eventos.

## 7. Nomenclatura

- Arquivos React: PascalCase.
- Hooks: `useCamelCase`.
- Mutations/queries: lowerCamelCase.
- Tipos: PascalCase.
- Futuras constantes globais: UPPER_SNAKE_CASE.

## 8. Regras para Evolução (Atualização Dinâmica)

Sempre que houver mudança em dados/fluxo/tracking, atualizar este documento (seções 5, 8, 10, 11 e outras relevantes) **no mesmo PR**.

Alterar / adicionar campo em `leads`:

1. `convex/schema.ts`
2. Args em `createLead` / `updateLead`
3. Fluxo no `Chatbot.tsx` (steps, validação, mensagens)
4. E-mail (`email.ts`)
5. Documentar aqui (estado + histórico)

Alterar fluxo chatbot:

- Atualizar: `getNextStep`, `getBotMessage`, `getProgressPercentage`, `validateInput`, `getStepIcon`.

Tracking novo:

- Usar `window.fbq('trackCustom', 'NomeEvento', {...})`.
- Registrar na seção 10.

E-mail novo ou ajuste:

- Validar variáveis ambiente.
- Incluir logs consistentes.

## 9. Diretrizes para Sugestões do Copilot

Copilot deve:

- Respeitar reducer e helpers existentes (não duplicar lógica).
- Evitar dependências externas sem forte justificativa.
- Sugerir reutilização/util abstraction de formatações (não copiar e colar blocos grandes).
- Manter checagem de `window.fbq` antes de eventos.
- Em novas actions: validar env antes de uso (padrão `email.ts`).
- Ao criar novos campos: garantir fluxo completo (schema → mutations → coleta → e-mail → doc).
- Garantir logs úteis, sem ruído excessivo.
- Evitar `any` onde tipo é determinável.

## 10. Eventos Rastreáveis

Ativos:

- `PageView` (auto no carregamento)

Planejados (não implementados):

- `ChatStarted` (quando primeira pergunta exibida)
- `LeadCreated` (após criação do lead)
- `LeadCompleted` (antes de envio de e-mail final)

## 11. Histórico de Mudanças

- 2025-08-22: Pixel movido para `index.html` (carregamento sempre ativo); hook simplificado; consentimento tornou-se apenas informativo.

## 12. Segurança & Privacidade

- Dados coletados: contato corporativo + qualificação; sem dados de saúde.
- CNPJ opcional; BrasilAPI consultada apenas se informado.
- Pixel sem gating de consentimento (avaliar necessidade legal futura).

## 13. Melhorias Futuras (Sugeridas)

- Extrair formatação para `lib/utils.ts`.
- Adicionar índices (email, numeroCnpj) em `leads`.
- Implementar tracking custom.
- Retry estruturado (exponencial) para envio de e-mail.
- Testes automatizados de action (mock Resend).

## 14. Procedimento de Atualização deste Documento

No PR que altera fluxo/dados/tracking: editar este arquivo antes do merge. Falhas em manter atualizado podem causar sugestões incorretas do Copilot.

Checklist rápido PR:

[ ] Schema atualizado
[ ] Mutations/Actions atualizadas
[ ] Chatbot fluxo consistente
[ ] E-mail refletindo campos
[ ] Tracking coerente
[ ] Documento ajustado (seções relevantes)

## 15. Mini Checklist para Novos Recursos

[ ] Campos novos no lead? -> schema + mutations + chatbot + email + doc
[ ] Mensagem nova? -> getBotMessage + validateInput + progress + doc
[ ] Evento Pixel novo? -> fbq check + seção 10
[ ] Integração externa? -> logs + try/catch + doc
[ ] tsc + eslint OK
[ ] Atualizar histórico (se relevante)

---
FIM DO DOCUMENTO – manter curto, preciso e sincronizado com o estado atual.
