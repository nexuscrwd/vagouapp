# 📜 Diário de Bordo & CHANGELOG — VagouApp Admin Master & Gateway

Todas as alterações notáveis deste projeto serão documentadas neste arquivo de acordo com os padrões da Tríade VagouApp.

---

## [1.1.5] - 2026-10-18
### Correção Definitiva de Integração do Embed Oficial (admvapp) & Logotipo Supabase
- **Ponto Único da Verdade (Single Source of Truth):**
  - O modal de cadastro (`VagouRegisterModal.tsx`) e a busca da API (`supabase.ts`) agora apontam diretamente e sem intermediários para `https://adm.vagouapp.com/embed` e `https://adm.vagouapp.com/api/public/*`.
  - Eliminadas quaisquer URLs de preview obsoletas ou portas que causavam `TypeError: Failed to fetch` e tela de erro 404.
  - Adicionado suporte a `postMessage` padronizado (JSON e objetos literais), tecla `Escape` e botão de fechamento explícito no topo do modal.
- **Roteador `/embed` Global (`App.tsx`):**
  - Rota direta `/embed` agora delega e serve o formulário soberano de `https://adm.vagouapp.com/embed` em tela cheia.
- **Resolução & Fallback do Logotipo Oficial (`OfficialLogoDisplay.tsx` & `VagouOfficialLogo.tsx`):**
  - Incluído o asset empacotado `logo.png` na cadeia de resolução de candidatos do Supabase Storage para garantir exibição nítida, com fundo transparente e texto branco mesmo se o bucket não estiver populado.
- **Gerador de Código Embed no Admin Master (`AdminMasterSuite.tsx`):**
  - Adicionado o modal "Código de Incorporação Embed" com seleção de formulários (`estabelecimento`, `usuario`, `usuario_login`, `mnv_cadastro`, `mnv_login`), cópia com um clique do snippet `<iframe ...>` e banner oficial do Single Source of Truth.

## [1.1.4] - 2026-10-18
### Transparência do Logotipo & Limpeza Visual Estrita
- **Remoção de Span/Botão Auxiliar:** Removido o botão e span de texto abaixo do logo no Gateway Hub (`VagouGatewayHub.tsx`), mantendo a área do topo exclusivamente dedicada à imagem do logotipo.
- **Div de Logotipo 100% Transparente (`OfficialLogoDisplay.tsx`):**
  - Removido fundo escuro (`bg-slate-900/95`), borda (`border-slate-800`) e sombra da `div` contêiner do logo.
  - Aplicadas classes `bg-transparent border-0 shadow-none` para que unicamente a arte oficial do logotipo apareça sobre o background.
- **Conexão Direta com Supabase Storage (`SupabaseLogoConfigModal.tsx`):** Modal dedicado e independente para validação e persistência da URL pública do bucket `media` sem qualquer recriação por IA.

## [1.1.3] - 2026-10-16
### Supabase Storage & Ajustes de Identidade Visual
- **Remoção de Elemento `<p>`:** Removido o texto descritivo abaixo da moldura do logotipo no Gateway Hub (`VagouGatewayHub.tsx`), atendendo à seleção de foco do usuário.
- **Integração com Supabase Storage (`OfficialLogoDisplay` & `VagouOfficialLogo`):**
  - Configurado para carregar o logotipo oficial prioritariamente do bucket `media` no Supabase Storage (`vagou_logo_transparente_texto_branco.png`).
  - Implementado fallback automático com `onError` para o asset local de alta fidelidade com texto branco sólido e checkmark em gradiente esmeralda.
- **Script SQL de Mídia (`src/db/supabase_media_storage.sql`):** Criado script SQL completo e idempotente para criação do bucket `media`, políticas RLS públicas de leitura/restritas de escrita e tabela `public.app_media`.

## [1.1.2] - 2026-10-16
### Alinhamento Visual Oficial da Tríade (1ª Etapa de Cadastro)
- **Componente `TriadeUserCheckStep` (`src/components/TriadeUserCheckStep.tsx`):** Implementado rigorosamente conforme a especificação visual oficial da Tríade VagouApp.
- **Estrutura Visual:**
  - Ícone central de usuário com container `emerald-500/10` e borda `emerald-500/30`.
  - Título oficial: *"O estabelecimento a ser criado já possui usuário cadastrado?"*.
  - Grade de seleção com cards oficiais: **SIM** (`bg-emerald-950/30`, borda `emerald-500/40`, texto `emerald-400`, ícone `Check`) e **NÃO** (`bg-slate-800/60`, borda `slate-700`, ícone `UserPlus`).
  - Selo de rodapé institucional: *"Ambiente Oficial VagouApp · Governança da Tríade"* com ícone `ShieldCheck`.
- **Integração no Embed Soberano:** Atualizado `SovereignEmbedForm.tsx` para renderizar `TriadeUserCheckStep` na etapa `'user_check'`.

## [1.1.1] - 2026-10-16
### Correção Crítica & Ajuste de Embed
- **Componente Oficial `VagouRegisterModal`:** Criado em `src/components/VagouRegisterModal.tsx` com iframe dedicado apontando para `https://adm.vagouapp.com/embed?form=estabelecimento` (e resolução transparente em ambiente de preview/local para `/embed?form=estabelecimento`).
- **Desacoplamento de Redirecionamento Indevido:** Corrigido o botão "Criar meu negócio" no Gateway (`VagouGatewayHub.tsx`) e no Hub de Contas (`UserBusinessHubModal.tsx`) para abrir imediatamente o modal de cadastro soberano, sem jamais redirecionar para a vitrine do salão em `seunegocio.vagouapp.com`.
- **Roteamento Cloudflare (`wrangler.toml`):** Adicionada a rota `adm.vagouapp.com/*` na configuração de deploy dos Workers para unificar a Central Soberana.

## [1.1.0] - 2026-10-16
### Alterado & Padronizado (Diretriz da Tríade)
- **Eliminação de Código Nativo Duplicado:** Removido o formulário local `TriadeEstablishmentMasterForm.tsx`.
- **Implementação do Modal de Embed Oficial (`VagouRegisterModal` / `VagouMasterFormModal`):**
  - Iframe consumindo em tempo real: `https://adm.vagouapp.com/embed?form=estabelecimento`.
  - Escuta via `window.addEventListener('message')` para eventos `CLOSE` e `SALON_MASTER_SUCCESS`.
- **Rota Soberana de Embed (`SovereignEmbedForm.tsx`):** Rota `/embed?form=estabelecimento` implementada na própria aplicação para servir a Central Soberana e responder via `postMessage`.

---

## [1.0.0] - 2026-10-15
### Adicionado
- **Gateway Hub Oficial (`vagouapp.com`):**
  - Roteamento inteligente bilateral: Consumidor (`portal.vagouapp.com`) e Estabelecimento (`seunegocio.vagouapp.com`).
  - Logotipo institucional vetorial `VagouOfficialLogo` com gradiente oficial `#087A2A` -> `#20C933` -> `#38E54B`.
- **Painel de Admin Master Corporativo (`adm.vagouapp.com`):**
  - Dashboard Executivo com indicadores em tempo real: Salões Ativos, Fila de Moderação, Agendamentos do Dia, Vagas Relâmpago Ativas e Volume GMV.
  - Módulo de Governança de Estabelecimentos (Tenants):
    - Fila de moderação com aprovação/reprovação.
    - Concessão/revogação do Selo de Verificado (`is_verified`).
    - Editor Master de dados críticos cadastrais (CNPJ/CPF, Razão Social, Slug, Cidade/UF, Telefone).
    - Mecanismo de suspensão e reativação instantânea com auditoria de motivo.
  - Auditoria do Radar de Vagas Relâmpago (gestão de slots ociosos, descontos e status).
  - Auditoria Global de Agendamentos entre `pvapp` e `mnvapp`.
  - Monitor de Infraestrutura, Supabase Cluster, SSL e rotas Wildcard Cloudflare (`*.vagouapp.com`).
  - **Emissor de Comunicado Técnico Oficial (O 7º Mandamento):**
    - Notificador e exportador de migrações e especificações de schema para os times de `pvapp` e `mnvapp`.
- **Configuração de Infraestrutura:**
  - `wrangler.toml` configurado para rotas Cloudflare Workers (`vagouapp.com`, `www.vagouapp.com`, `adm.vagouapp.com`).
  - Tipografia institucional Poppins via Google Fonts.
  - Conformidade estrita com a Regra de Contraste (`#20C933` fundo sempre com `text-white`).
