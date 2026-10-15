# 📜 Diário de Bordo & CHANGELOG — VagouApp Admin Master & Gateway

Todas as alterações notáveis deste projeto serão documentadas neste arquivo de acordo com os padrões da Tríade VagouApp.

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
