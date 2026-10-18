# Arquitetura de Acesso Unificado & Redirecionamento Inteligente — VagouApp Gateway

Plano detalhado para implementar no Gateway oficial (`vagouapp.com`) a experiência bilateral de entrada: um campo de busca rápida com autocompletar por nome/slug para redirecionamento imediato ao salão, e uma Central de Login Unificado com acervo de estabelecimentos multi-negócio e navegação entre os apps da Tríade.

---

## Revisão do Usuário & Decisões Confirmadas

> [!IMPORTANT]
> As decisões de produto foram alinhadas e confirmadas na Fase 1:
> - **Estrutura de Acesso**: Modelo duplo — Campo de acesso rápido ao salão por nome/slug no topo/hero E botão de login com acervo completo de estabelecimentos.
> - **Input de Busca Rápida**: Digitação por nome ou slug do estabelecimento com autocompletar em tempo real e redirecionamento imediato para `https://seunegocio.vagouapp.com?salon={slug}`.
> - **Experiência Mobile**: Roteamento responsivo via navegador web compatível nativamente com o PWA do salão instalado no dispositivo.
> - **Design System**: Respeito rigoroso à regra de 4px (`rounded-[4px]`) e contraste estrito de texto/ícones brancos em fundos `#20C933`.

---

## 1. Visão Geral & Conceito Central

### O Problema Resolvido:
Atualmente, quando um proprietário de salão de beleza ou barbearia acessa o Gateway oficial (`vagouapp.com`), ele precisava clicar em links genéricos ou navegar manualmente até `seunegocio.vagouapp.com`. Da mesma forma, gestores que possuem mais de uma filial ou unidade não tinham uma visão consolidada de seu acervo de estabelecimentos no ponto de entrada central.

### A Solução:
1. **Quick Salon Launcher (Busca Rápida de Estabelecimento)**:
   - Um campo proeminente de busca no Gateway com feedback instantâneo.
   - Conforme o dono digita o nome ou o slug do seu salão (ex: `"dom"`, `"barbearia-dom"` ou `"bella"`), uma lista suspensa refinada exibe os estabelecimentos cadastrados e homologados.
   - Ao selecionar ou pressionar `Enter`, o usuário é redirecionado instantaneamente para a URL do seu salão no parceiro (`https://seunegocio.vagouapp.com?salon=slug`) em desktop e mobile.

2. **Hub de Login com Acervo Multi-Estabelecimentos (Tríade SSO)**:
   - Um modal/painel de autenticação central no Gateway.
   - Ao informar e-mail e senha do gestor, o sistema carrega o **Acervo de Negócios** do usuário (ex: Salão Matriz Jardins, Filial Pinheiros, Studio Express).
   - O gestor pode alternar ou entrar diretamente em qualquer um dos seus estabelecimentos, além de ter atalhos rápidos para o Portal de Vagas (`pvapp`) e Console Corporativo (`admvapp`).

---

## 2. Experiência do Usuário (UX) & Design Visual

### Fluxos Principais do Usuário

```
[ Usuário no Gateway vagouapp.com ]
           │
           ├─────────────────────────────────────────────────┐
           ▼                                                 ▼
[ Acesso Rápido por Nome / Slug ]               [ Central de Login & Acervo ]
  ├── Digita "dom" ou "bella"                      ├── Digita e-mail e senha
  ├── Autocompletar com badge e cidade             ├── Sistema autentica no cluster
  └── Redirecionamento instantâneo para:            └── Exibe Acervo de Negócios:
      seunegocio.vagouapp.com?salon=slug               ├── Salão A (Matriz) ➔ [Gerenciar]
                                                       ├── Salão B (Filial) ➔ [Gerenciar]
                                                       ├── [+] Cadastrar Novo Estabelecimento
                                                       └── Atalhos: Portal pvapp & Admin
```

### Visual Identity & Estilo
- **Paleta**: Fundo ultra-escuro `bg-slate-950`, superfícies `bg-slate-900`, bordas sutis `border-slate-800`.
- **Acento Institucional**: `#20C933` (com gradiente oficial `#087A2A` $\to$ `#20C933` $\to$ `#38E54B`).
- **Contraste**: Fundo verde sólido sempre acompanhado de tipografia branca em negrito (`text-white font-bold`).
- **Raio de Borda**: 100% dos elementos, botões, modais, campos de input e cards com `rounded-[4px]`.
- **Tipografia**: Poppins (300 a 800) com números tabulares `tabular-nums` para slugs e métricas.

---

## 3. Decisões Técnicas de Produto & Arquitetura

### Decisão 1: Quick Salon Search no Gateway
- **Abordagem**: Implementar um componente de busca inteligente `QuickSalonLauncher` posicionado estrategicamente na barra superior e/ou no Hero do Gateway.
- **Mecanismo**: Busca com debounce (150ms) indexando `name` e `slug`.
- **Fallback**: Se o usuário digitar um slug exato e apertar `Enter`, o redirecionamento ocorre mesmo sem selecionar a lista.

### Decisão 2: Acervo Multi-Negócio do Proprietário
- **Abordagem**: Criar o componente modal `UserBusinessHubModal` que exibe todos os salões associados ao `ownerEmail`.
- **Permissões**: Exibe status do salão (`ativo`, `moderação pendente`), atalho para abrir o dashboard de cada unidade e opção direta para iniciar o `TriadeEstablishmentMasterForm` para abrir uma nova filial.

### Decisão 3: Redirecionamento Mobile e PWA
- **Abordagem**: Em dispositivos móveis, o redirecionamento utiliza navegação web padrão com parâmetros de contexto (`?salon=slug&source=gateway`). Navegadores com PWA instalado reconhecem o escopo de domínio e abrem diretamente no app correspondente.

---

## 4. Diagrama da Arquitetura de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VagouGatewayHub.tsx                           │
│                                                                        │
│  ┌────────────────────────┐              ┌──────────────────────────┐  │
│  │    VagouOfficialLogo   │              │   QuickSalonLauncher     │  │
│  │   (Gradiente Oficial)  │              │ (Busca + Autocompletar)  │  │
│  └────────────────────────┘              └────────────┬─────────────┘  │
│                                                       │                │
│  ┌────────────────────────────────────────────────────▼─────────────┐  │
│  │                Hero: 2 Grandes Decisões                          │  │
│  │   [Card 1: Consumidor]         [Card 2: Estabelecimento]         │  │
│  │   - Acesso ao pvapp            - TriadeEstablishmentMasterForm   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 UserBusinessHubModal.tsx                         │  │
│  │   - Login unificado com e-mail/senha                             │  │
│  │   - Acervo de Salões do Proprietário (Multi-Tenancy)             │  │
│  │   - Direcionamento instantâneo para seunegocio.vagouapp.com      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Roteiro de Implementação das Fases

1. **Componente `QuickSalonLauncher.tsx`**:
   - Campo de entrada estilizado com ícone de salão/busca e atalho de teclado.
   - Lista flutuante de autocompletar com destaque de coincidência de texto, categoria e cidade.
   - Redirecionador para `https://seunegocio.vagouapp.com`.

2. **Componente `UserBusinessHubModal.tsx`**:
   - Tela de login com e-mail/senha.
   - Visualização do acervo de estabelecimentos vinculados à conta.
   - Ações de troca rápida de salão e atalhos para todos os apps da Tríade.

3. **Integração no `VagouGatewayHub.tsx`**:
   - Posicionar a busca rápida no cabeçalho ou hero.
   - Botão "Meus Negócios / Entrar" no cabeçalho abrindo o hub de acervo.

4. **Verificação de Compilação & Estilos**:
   - Garantir compilação com `tsc && vite build` sem avisos ou erros.
   - Garantir bordas de 4px e regras estritas de contraste.
