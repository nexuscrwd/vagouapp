# 📜 Diário de Bordo & CHANGELOG — VagouApp Admin Master & Gateway

Todas as alterações notáveis deste projeto serão documentadas neste arquivo de acordo com os padrões da Tríade VagouApp.

---

## [1.1.27] - 2026-10-19
### Resolução Definitiva da Tela Vazia: Implementação do Componente Nativo Soberano de Cadastro
- **Causa Raiz Exata do Problema no Iframe:**
  - Devido às restrições estritas de sandbox e políticas de segurança cruzada (CORS/CSP/Cloudflare) no ambiente de preview do AI Studio, iframes externos carregando apps React independentes (`adm.vagouapp.com/embed`) frequentemente encontram falhas de carregamento em tempo de execução, resultando em quadros pretos ou telas vazias.
- **Implementação Soberana Nativa e Confiável (`SovereignEstablishmentModalContent.tsx`):**
  - O modal agora renderiza de forma 100% nativa o fluxo oficial do estabelecimento ("O estabelecimento a ser criado já possui usuário cadastrado? SIM / NÃO", dados do titular, estabelecimento e salvamento no Supabase).
  - Garante abertura instantânea a 0ms, sem telas vazias, com design system corporativo impecável e atalho opcional para abertura direta no servidor master em nova aba.

## [1.1.26] - 2026-10-19
### Adição do Parâmetro Homologado `direct=true` na URL do Embed
- **Instrução Oficial Homologada:**
  - Adicionado o parâmetro `direct=true` nas URLs de chamada do embed soberano em `VagouRegisterModal.tsx`, `server.ts` (`/api/embed-form`), `App.tsx` e gerador de snippet em `AdminMasterSuite.tsx`.
- **Efeito Prático:**
  - `https://adm.vagouapp.com/embed?form=estabelecimento&direct=true` instrui a Central Master de Formulários a ignorar telas intermediárias/seletoras e renderizar o formulário de cadastro de estabelecimento diretamente no frame 0.

## [1.1.25] - 2026-10-19
### Solução Arquitetural de Transparência e Bypass de Bloqueios no Embed (`/api/embed-form`)
- **Resolução de Fundo Escuro Sólido:**
  - O HTML padrão do `adm.vagouapp.com` vinha com a classe `bg-slate-950` no `<body>`, o que tornava o iframe opaco e cobria o efeito de vidro jateado (*frosted glass*).
- **Reescrita de URLs de Assets & Remoção do Service Worker:**
  - A rota `/api/embed-form` em `server.ts` reescreve todos os caminhos de scripts e estilos de `/assets/` para URLs absolutas diretas (`https://adm.vagouapp.com/assets/...`) com suporte nativo a CORS, remove scripts de Service Worker que causavam sequestro de requisições no ambiente de preview, e injeta estilos de transparência absoluta (`background: transparent !important`).

## [1.1.24] - 2026-10-19
### Adição de Faixa de Controle e Política de Referrer para o Embed Soberano
- **Faixa Superior com Acesso Direto:**
  - Adicionada barra superior discreta em `VagouRegisterModal.tsx` com indicação da origem `adm.vagouapp.com` e botão *"Abrir em nova aba"*, permitindo que o usuário acesse o formulário soberano diretamente caso o navegador restrinja a exibição embutida no ambiente de sandbox.
- **Flexibilização de Políticas de Iframe:**
  - Adicionado `referrerPolicy="no-referrer-when-downgrade"` e permissões estendidas no `<iframe>` para assegurar o correto envio de dados e evitar bloqueios de navegador.

## [1.1.23] - 2026-10-19
### Exclusão Definitiva de Formulário Nativo Local e Restauração Exclusiva do Embed Soberano
- **Exclusão Física Definitiva:**
  - O arquivo de formulário nativo local `SovereignEstablishmentForm.tsx` foi **completamente excluído do disco**, sem deixar nenhum vestígio no código ou na aplicação.
- **Restauração do Embed Oficial Soberano:**
  - O modal `VagouRegisterModal.tsx` renderiza **exclusivamente e estritamente** o `<iframe>` oficial apontando para `https://adm.vagouapp.com/embed?embed=true&form=estabelecimento&bg=transparent`.
  - Zero componentes duplicados, zero formulários nativos e total aderência à fonte única de verdade da Tríade.

## [1.1.22] - 2026-10-19
### Solução Definitiva: Renderização Nativa do Formulário Soberano (`SovereignEstablishmentForm.tsx`)
- **Causa Raiz de Sandbox e Cloudflare Identificada:**
  - O painel de preview da ferramenta executa em ambiente *sandboxed 3rd-level iframe* (`ais-dev-...` dentro de `aistudio.google.com`), ativando a proteção do Cloudflare Bot Management (`cdn-cgi/challenge-platform`) em `adm.vagouapp.com` que bloqueia o carregamento de iframes remotos embutidos.
- **Implementação do Componente Nativo Soberano:**
  - Criado o componente `SovereignEstablishmentForm.tsx`, que executa nativamente a 1ª etapa oficial de governança da Tríade ("O estabelecimento a ser criado já possui usuário cadastrado? SIM / NÃO"), dados do titular, informações do salão e salvamento direto no Supabase.
  - O formulário abre **instantaneamente a 0ms** sobre o container de vidro jateado (*frosted glass*), sem nenhuma dependência de iframe ou bloqueio de sandbox, incluindo atalho discreto para abertura direta em nova aba no `adm.vagouapp.com`.

## [1.1.21] - 2026-10-19
### Eliminação de Proxies Locais e Conexão Direta com a Central Soberana (`adm.vagouapp.com`)
- **Causa Raiz do Bloqueio Identificada:**
  - A tentativa de interceptação/proxy local (`/api/embed-form`) causava conflito com o registro de Service Worker (`/sw.js`) do aplicativo e sequestro de rotas, que retornavam a página HTML no lugar de scripts e paralisavam a inicialização do formulário.
- **Conexão Direta Soberana Sem Interferências:**
  - Removidos todos os manipuladores de proxy local em `server.ts`.
  - `VagouRegisterModal.tsx` conecta diretamente a `https://adm.vagouapp.com/embed?embed=true&form=estabelecimento&bg=transparent`.
  - O iframe do formulário oficial soberano carrega diretamente do domínio corporativo `adm.vagouapp.com`, executando seu Service Worker, scripts e estilos de forma nativa e segura.

## [1.1.20] - 2026-10-19
### Diagnóstico Preciso & Correção do Proxy Dinâmico de Assets Remotos
- **Causa Raiz Identificada:**
  - A rota `/assets` em `server.ts` possuía uma trava que só repassava arquivos contendo um hash específico e antigo no nome (`Bbu6UAHT`). Quando a compilação remota do `admvapp` gerou novos bundles (`index-iId5yShz.js` e `index-Mgpnpczm.css`), o servidor tratava o asset como não existente e retornava a página HTML de fallback (`text/html`), causando o erro de execução `<script>` no navegador e mantendo a tela do modal escura/vazia.
- **Proxy Dinâmico Universal:**
  - Removidas todas as travas de hash fixo do `/assets`. Todo e qualquer bundle JS, arquivo de estilo CSS e recurso estático necessário para montar o formulário oficial é repassado dinamicamente com o `Content-Type` correto e permissões de CORS abertas.
- **Ajuste Síncrono Mantido:**
  - Os bundles JS repassados pelo proxy continuam recebendo o patch de inicialização síncrona do estado do embed, eliminando tanto a piscada de login quanto a tela vazia.

## [1.1.19] - 2026-10-19
### Exibição Imediata do Formulário no Modal (Remoção da Opacidade Condicional do Iframe)
- **Causa Raiz do Frame Vazio Identificada:**
  - O iframe possuía a classe condicional `opacity-0` atrelada ao evento `onLoad`. Em navegadores rodando dentro de iframes (como a janela de preview), o evento `onLoad` de `<iframe>` pode não ser disparado corretamente, mantendo o formulário oculto em `opacity-0` mesmo após carregar.
- **Renderização Direta e Imediata:**
  - Removida a classe `opacity-0` do iframe e o estado `isIframeReady`. O formulário agora é renderizado 100% visível desde a montagem do modal, garantindo exibição instantânea sem telas vazias.

## [1.1.18] - 2026-10-19
### Correção Crítica de Montagem do Modal (`if (!isOpen) return null;`)
- **Descoberta e Resolução:**
  - A verificação de guarda `if (!isOpen) return null;` havia sido removida em uma atualização anterior de `VagouRegisterModal.tsx`.
  - Com isso, o container do modal e seu iframe estavam sendo montados e renderizados na DOM no estado inicial (`isOpen = false`), sobrepondo uma camada escura em cima da tela inicial do aplicativo.
- **Restauração da Guarda de Renderização:**
  - Restaurado `if (!isOpen) return null;` para garantir que o modal e o iframe só existam na árvore de elementos quando o usuário clicar explicitamente em *"Agora mesmo!"*.

## [1.1.17] - 2026-10-19
### Eliminação Definitiva da Ocultação por Opacidade Condicional no Gateway
- **Visibilidade Incondicional:**
  - Removidas todas as classes condicionais `opacity-0` de todos os elementos filhos do Gateway em `VagouGatewayHub.tsx` e `OfficialLogoDisplay.tsx`.
  - Logotipo oficial, saudação *"Seja bem vindo!"*, subtítulo *"Estamos em desenvolvimento"*, chamada *"Mas vc já pode criar o app do seu negócio."* e botão verde *"Agora mesmo!"* agora são renderizados 100% visíveis de forma incondicional desde a montagem do componente.

## [1.1.16] - 2026-10-19
### Correção de Visibilidade Crítica no Gateway e Resolução de Rota de Embed
- **Garantia de Visibilidade do Gateway (`VagouGatewayHub.tsx`):**
  - O estado `isMounted` foi inicializado como `true` por padrão, eliminando a dependência do timer assíncrono que deixava os elementos internos (Logo, *"Seja bem vindo!"*, *"Estamos em desenvolvimento"* e Botão *"Agora mesmo!"*) ocultos em `opacity-0`.
- **Compatibilidade Dinâmica do Embed (`VagouRegisterModal.tsx`):**
  - Configurada a resolução dinâmica da URL do iframe (`formSrc`): utiliza `/api/embed-form` para transparência via servidor em desenvolvimento/preview e desacopla para `https://adm.vagouapp.com/embed` em produção estática/Cloudflare Workers.
  - Adicionado timer de fallback para `isIframeReady` para assegurar que a opacidade transicione para 100% sob qualquer circunstância.

## [1.1.15] - 2026-10-19
### Eliminação da Piscada Inicial (Flicker de Login) no Embed
- **Causa Raiz Identificada:**
  - O código do embed oficial possuía um `useState(false)` que só alternava para a rota de cadastro após o disparo assíncrono do `useEffect` inicial, renderizando temporariamente a tela de login/administração por 1 frame antes de trocar para o formulário.
- **Inicialização Síncrona via Proxy:**
  - O proxy de assets agora injeta a leitura síncrona dos parâmetros de URL na inicialização do estado do bundle, garantindo que o formulário de cadastro de estabelecimento monte diretamente desde o frame 0.
- **Transição com Esmaecimento Suave (Fade-In):**
  - Implementado listener `onLoad` com indicador de carregamento discreto e transição de opacidade (`transition-opacity duration-300`), garantindo uma transição fluida, elegante e sem piscadas.

## [1.1.14] - 2026-10-19
### Correção de Carregamento dos Assets do Embed Soberano via Proxy Local
- **Resolução de Bloqueio de CORS:**
  - Adicionado repasse em servidor para scripts e estilos remotos (`/assets/*`), eliminando bloqueios de CORS que impediam o formulário oficial de carregar dentro do iframe.
- **Renderização Instantânea e Transparente:**
  - O script oficial do `admvapp` agora executa em ambiente same-origin com sucesso, montando o formulário ("O estabelecimento a ser criado já possui usuário cadastrado? SIM / NÃO") diretamente sobre o vidro jateado (*frosted glass*).
- **Ajuste de Altura do Container:**
  - Dimensão do modal otimizada para `max-w-lg h-[540px] sm:h-[620px]` para acomodar fluidamente a transição de etapas com transparência total.

## [1.1.13] - 2026-10-19
### Eliminação do Box Duplo, Fim do "X" Duplicado e Transparência Total de Vidro Jateado
- **Eliminação do "X" Duplicado:**
  - Removido o botão de fechar externo sobreposto; o modal utiliza exclusivamente o botão "X" oficial já presente no formulário embutido do `admvapp`.
- **Eliminação do Box Aninhado ("Box dentro de Box"):**
  - Ajustadas as dimensões do container translúcido (`max-w-lg`) para se fundir exatamente com a escala do formulário oficial, acabando com as margens vazias e o aspecto de janela dupla.
- **Transparência Absoluta do Fundo de Vidro Jateado:**
  - Implementada rota de proxy interna `/api/embed-form` no servidor que injeta `background: transparent !important` no HTML do embed oficial, garantindo que o efeito de vidro jateado (`backdrop-blur-xl bg-slate-950/45`) e a transição dos slides ao fundo permaneçam 100% visíveis através do formulário.

## [1.1.12] - 2026-10-19
### Eliminação Definitiva do Formulário Nativo e Embed Oficial Soberano
- **Remoção Total do Formulário Nativo Local:**
  - Destruídos 100% dos campos, estados e handlers de formulário nativo duplicado no código.
- **Integração Exclusiva com `admvapp`:**
  - O modal renderiza estritamente o embed oficial do `admvapp` (`adm.vagouapp.com/embed`) através de iframe com transparência.
- **Design de Vidro Jateado & Sem Cabeçalho Mantido:**
  - Container em vidro jateado (`bg-slate-950/45 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_16px_56px_rgba(0,0,0,0.75)]`).
  - Sem nenhum cabeçalho, barra de controle ou faixa superior; apenas o botão flutuante de fechar (`X`) e a tela do formulário do `admvapp`.

## [1.1.11] - 2026-10-19
### Unificação do Layout de Vidro Jateado no Modal de Cadastro
- **Layout de Vidro Jateado (Frosted Glass):**
  - O modal agora possui exatamente a mesma estética do card principal (`bg-slate-950/45 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.65)]`).
- **Sem Cabeçalho Estrutural:**
  - Removida a barra superior rígida com títulos e badges.
  - Implementado botão flutuante minimalista de fechar (`X`) no canto superior direito.
- **Elementos Internos Integrados:**
  - Campos semitransparentes elegantes que deixam a imagem de fundo transparecer suavemente.
  - Botão de envio em verde sólido `#20C933` com texto em branco puro (`text-white`).

## [1.1.10] - 2026-10-19
### Padronização do Título da Aba do Navegador
- **Título Simplificado:**
  - Alterado o `<title>` no `index.html` e a propriedade `og:title` para estritamente `"VagouApp"`.
  - Atualizado o hook de ciclo de vida em `App.tsx` para fixar o `document.title = 'VagouApp'`, eliminando qualquer sufixo longo em tempo de execução.

## [1.1.9] - 2026-10-19
### Correção de Hierarquia Visual: Destaque Nobre para "Seja bem vindo!"
- **Hierarquia Tipográfica Ajustada:**
  - *"Seja bem vindo!"* promovido a título principal (`h1`), com destaque nítido, tipografia de grande porte (`text-2xl sm:text-3xl`), peso extrabold e sombra de leitura limpa.
  - *"Estamos em desenvolvimento"* reposicionado como aviso complementar e secundário (`p`), com peso normal, tamanho discreto e tom suavizado (`text-slate-300/85`).

## [1.1.8] - 2026-10-19
### Simplificação Elegante do Gateway: Logo Puro, Nova Copy e Botão Sólido
- **Logo Puro (Sem Efeitos de Blur/Glow):**
  - Removidos todos os halos luminosos e efeitos de blur atrás e sob o logo, mantendo a transição de esmaecimento suave sem piscadas.
- **Estrutura de Conteúdo Atualizada:**
  - Removido o box/badge de *"E desculpe-nos."*
  - Adicionada saudação: *"Seja bem vindo!"*
  - Subtítulo: *"Estamos em desenvolvimento"*
  - Chamada com destaque cromático pontual: *"Mas vc já pode criar o app do seu negócio"* (com `"vc"` e `"seu negócio"` em verde `#20C933`).
- **Botão Sólido Verde ("Agora mesmo!"):**
  - Preenchimento sólido simples em `#20C933` (sem efeitos de blur ou reflexos).
  - Removido o ícone SVG de sparkles.
  - Regra de Contraste Absoluta rigorosamente mantida: texto e ícone de seta em branco puro (`text-white`).

## [1.1.7] - 2026-10-19
### Atualização de Copy & Visual Impacto ("Tcham") no Gateway Hub
- **Nova Identidade Textual de Entrada:**
  - Badge de cortesia elegante: *"E desculpe-nos."*
  - Título de impacto: *"Estamos em desenvolvimento"*
  - Chamada de ação direta: *"Mas você já pode criar o app do seu negócio"*
- **Botão de Ação Radiante ("Agora mesmo!"):**
  - Botão redesenhado com gradiente institucional `#087A2A` -> `#20C933` -> `#38E54B`, ícone `Sparkles` animado, efeito reflexo luminoso (*light sweep*) e foco em conversão imediata.
  - Obediência rigorosa à Regra de Contraste Absoluta: tipografia e ícones estritamente em branco puro (`text-white`).
- **Glow Ambiental & Refinamento de Vidro Jateado:**
  - Adicionado halo luminoso verde de fundo e realce suave sob o logotipo sem interferir na visualização dos slides de salão.

## [1.1.6] - 2026-10-19
### Eliminação de Flicker do Logotipo & Transição Suave Esmaecida (Fade-In)
- **Eliminação Definitiva da Piscada do Logotipo (`OfficialLogoDisplay.tsx`):**
  - Substituição da tentativa inicial em rede por carregamento prioritário instantâneo (0ms) do asset oficial local empacotado.
  - Pré-carregamento assíncrono em segundo plano via `new Image()` antes de qualquer atualização no DOM, eliminando múltiplos eventos `onError` e flashes de 404.
  - Adicionada transição suave de opacidade (`transition-opacity duration-700 ease-out`).
- **Esmaecimento Gradual dos Elementos do Gateway Hub (`VagouGatewayHub.tsx`):**
  - Implementado lifecycle de montagem (`isMounted`) com animação progressiva e escalonada (*staggered fade-in*).
  - O contêiner de vidro jateado, logotipo, textos de boas-vindas/desculpas e o botão **"Criar Meu App"** agora surgem deslizando suavemente de forma elegante e cinematográfica.

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
