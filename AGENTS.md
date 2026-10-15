# 🏛️ Diretrizes de Agentes & Engenharia — VagouApp (adm.vagouapp.com)

## 📌 Identidade do Projeto
- **Aplicação:** `admvapp` (adm.vagouapp.com / Gateway vagouapp.com)
- **Papel na Tríade:** Painel de Admin Master Corporativo, Soberano na Governança, Moderação de Estabelecimentos, Auditoria Cadastral e Infraestrutura/DNS.
- **Ecossistema:** Tríade VagouApp compartilhando o mesmo cluster Supabase.
  1. `pvapp` (portal.vagouapp.com) — Aplicativo do Consumidor / Marketplace (Radar de vagas e agendamento).
  2. `mnvapp` (seunegocio.vagouapp.com) — Aplicativo do Parceiro (Gestão diária de agenda, serviços e equipe do salão).
  3. `admvapp` (adm.vagouapp.com) — Este projeto. Soberano na moderação, governança master e emissão de comunicados técnicos.

---

## 🛑 O 7º Mandamento (LEI SUPREMA & INEGOCIÁVEL)
> **Toda e qualquer alteração de schema no Supabase, colunas, status, triggers, rotas ou design system realizada neste projeto DEVE OBRIGATORIAMENTE gerar um Comunicado Técnico Oficial detalhado e formal para os outros dois projetos da Tríade (`pvapp` E `mnvapp`). Zero pontas soltas.**

### Protocolo de Comunicado Técnico:
1. Identificação do Schema ou Recurso Alterado (Tabela, Coluna, Tipo, Enum ou Rota).
2. Justificativa Estratégica / Técnica.
3. Impacto Específico em `pvapp` (ex.: novos filtros de busca ou flags como `is_verified`).
4. Impacto Específico em `mnvapp` (ex.: campos obrigatórios do onboarding ou bloqueio de agenda por suspensão).
5. Script SQL de Migração idempotente (`IF NOT EXISTS`, `CASCADE`, etc.).
6. Data de Homologação e Assinatura do Engenheiro Chefe.

---

## 🎨 Padrões de Design System Corporativo
- **Tema:** Dark Theme elegante (`bg-slate-950`, superfícies `bg-slate-900`, bordas `border-slate-800`).
- **Cor Primária Institucional:** `#20C933` (com gradiente oficial `#087A2A` -> `#20C933` -> `#38E54B`).
- **Regra de Contraste Absoluta:** Todo elemento com fundo verde sólido `#20C933` DEVE OBRIGATORIAMENTE utilizar texto/ícone branco (`text-white`).
- **Tipografia:** Poppins (300 a 900). Números tabulares com `tabular-nums` ou fonte mono em relatórios e auditorias.
- **Ícones:** 100% Lucide-React sem bibliotecas secundárias.
- **Zero-Pill Discipline:** Metadados limpos com separadores tipográficos (`·`, `/`); botões funcionais com bordas refinadas.

---

## 🔐 Escopo Operacional do Engenheiro
1. **Governança de Tenants:** Aprovar, rejeitar ou solicitar ajustes em salões pendentes; conceder/revogar selo `is_verified`; suspender salões por violação de termos.
2. **Auditoria de Radar:** Monitorar vagas relâmpago ativas, horários ociosos anunciados e conferir integridade dos agendamentos em tempo real.
3. **Monitoramento de Infraestrutura:** Integridade da conexão Supabase, Cloudflare Workers, rotas de domínio (*.vagouapp.com) e certificados SSL.
4. **Segurança e RLS:** Respeitar o isolamento de tenants e permissões master (`role: super_admin`).
