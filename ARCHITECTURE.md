# 📐 Arquitetura do Sistema — VagouApp Admin Master & Gateway

## 1. Visão Geral da Topologia da Tríade

```
                             [ Cloudflare Edge Router ]
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
  vagouapp.com /                   portal.vagouapp.com            seunegocio.vagouapp.com
  adm.vagouapp.com                 [pvapp - Consumidor]           [mnvapp - Parceiro/Salão]
  [admvapp - Admin Master Hub]             │                                │
        │                                │                                │
        └────────────────────────────────┴────────────────────────────────┘
                                         │
                                         ▼
                             [ Supabase Unified DB & Auth ]
                                 ├── salons (tenants)
                                 ├── professionals
                                 ├── services
                                 ├── appointments
                                 ├── lightning_slots (radar)
                                 ├── technical_communiques
                                 └── audit_logs
```

---

## 2. Componentes do Projeto `admvapp`

1. **Gateway Hub (`vagouapp.com`):**
   - Página inicial oficial com roteamento transparente para consumidores (`portal.vagouapp.com`) e parceiros/estabelecimentos (`seunegocio.vagouapp.com`).
   - Botão direto para criação de novo estabelecimento e atalho seguro para o Painel Corporativo.

2. **Painel Master Corporativo (`adm.vagouapp.com`):**
   - **Dashboard Executivo:** Métrica de salões ativos, salões pendentes de moderação, agendamentos do dia, vagas relâmpago ativas e faturamento transacionado no ecossistema.
   - **Fila de Moderação de Estabelecimentos (Tenants):**
     - Aprovação de estabelecimentos com validação de CNPJ/CPF, razão social, slug, endereço completo, telefone e categoria.
     - Toggle de concessão/revogação do **Selo de Verificado (`is_verified`)**.
     - Edição Master de dados cadastrais diretamente no registro do banco.
     - Ações de Suspensão (`status: suspended`) e Reativação imediata (`status: active`).
   - **Auditoria de Radar & Vagas Relâmpago:**
     - Acompanhamento das vagas publicadas pelos parceiros com desconto dinâmico, profissional designado, hora início/fim e status (disponível, reservado, expirado).
   - **Auditoria de Agendamentos:**
     - Visão global de reservas entre clientes de `pvapp` e salões de `mnvapp`, com filtros por status (`confirmed`, `completed`, `cancelled`, `no_show`).
   - **Monitor de Infraestrutura & DNS:**
     - Status da API Supabase, latência média, status Cloudflare Edge, SSL e checagem de rotas Wildcard (`*.vagouapp.com`).
   - **Central de Comunicados Técnicos Oficiais (O 7º Mandamento):**
     - Emissor de comunicados com notificação para sincronização com as bases de código de `pvapp` e `mnvapp`, com exportação de script SQL e markdown pronto para envio aos repositórios parceiros.

---

## 3. Estrutura de Tabelas Supabase Relevantes

- `public.salons`:
  - `id`: uuid (PK)
  - `name`: text
  - `slug`: text (unique)
  - `cnpj_cpf`: text
  - `phone`: text
  - `city`: text
  - `state`: text
  - `status`: enum ('active', 'pending', 'incomplete', 'suspended')
  - `is_verified`: boolean (default false)
  - `rating`: numeric (default 5.0)
  - `created_at`: timestamptz

- `public.lightning_slots` (Radar de Vagas Relâmpago):
  - `id`: uuid (PK)
  - `salon_id`: uuid (FK salons)
  - `service_name`: text
  - `professional_name`: text
  - `original_price`: numeric
  - `discount_price`: numeric
  - `slot_time`: timestamptz
  - `status`: enum ('available', 'booked', 'expired')

- `public.appointments`:
  - `id`: uuid (PK)
  - `salon_id`: uuid (FK salons)
  - `customer_name`: text
  - `customer_phone`: text
  - `service_name`: text
  - `scheduled_at`: timestamptz
  - `status`: enum ('confirmed', 'completed', 'cancelled')
  - `total_price`: numeric

- `public.technical_communiques`:
  - `id`: uuid (PK)
  - `code`: text (ex: COM-2026-001)
  - `title`: text
  - `scope`: text ('schema', 'enum', 'route', 'design_system')
  - `affected_apps`: text[] (['pvapp', 'mnvapp'])
  - `sql_migration`: text
  - `created_at`: timestamptz
