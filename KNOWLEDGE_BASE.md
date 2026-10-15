# 🧠 Base de Conhecimento — Ecossistema VagouApp

## 1. Glossário Operacional da Tríade

| Termo | Definição |
| :--- | :--- |
| **Tríade VagouApp** | Conjunto composto por `pvapp` (portal do consumidor), `mnvapp` (gestão do parceiro) e `admvapp` (admin master corporativo). |
| **Radar de Vagas** | Mecanismo em tempo real onde salões em `mnvapp` liberam horários ociosos imediatos para o mesmo dia com descontos promocionais, exibidos prioritariamente no mapa e lista em `pvapp`. |
| **Selo Verificado (`is_verified`)** | Distintivo concedido exclusivamente pelo `admvapp` após verificação de documentação (CNPJ, endereço físico, foto da fachada e alvará). Garante prioridade na busca do Radar em `pvapp`. |
| **Fila de Moderação** | Lista de triagem em `admvapp` de novos salões cadastrados via fluxo de onboarding. O salão permanece em status `pending` até auditoria de conformidade. |
| **Comunicado Técnico Oficial** | Documento obrigatório emitido por `admvapp` sempre que houver alteração estrutural no Supabase ou contratos de API, prevenindo quebras em `pvapp` e `mnvapp`. |

---

## 2. Padrões de Dados e Validações

- **Slugs de Estabelecimentos:** Devem ser normalizados em kebab-case minúsculo (ex: `studio-bella-vila-mariana`).
- **CNPJ/CPF:** Devem ser validados quanto a dígitos verificadores e armazenados sanitizados ou com máscara padrão.
- **Formato Monetário:** Moeda corrente em Reais (`BRL - R$`). Valores em banco representados em `numeric(10,2)`.
- **Fuso Horário Padrão:** `America/Sao_Paulo` (UTC-3).

---

## 3. Matriz de Status de Estabelecimentos (`salons.status`)

1. `incomplete`: Cadastrado porém com etapas de perfil ou serviços pendentes.
2. `pending`: Submetido para análise cadastral pelo time do `admvapp`.
3. `active`: Homologado e apto a receber agendamentos e publicar vagas no Radar.
4. `suspended`: Temporariamente desativado por denúncia, inadimplência ou descumprimento de termos de uso.
