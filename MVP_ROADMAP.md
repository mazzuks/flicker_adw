# 🚀 MVP Roadmap - Adworks (Empresa Pronta)

Este arquivo é o nosso centro de comando para o desenvolvimento do MVP. Aqui monitoramos o progresso de cada funcionalidade, localizando onde estão as implementações no código e no banco de dados.

---

## 🏗️ 0. Checkpoint & Governança
- [x] **Setup do Repositório**: Base Vite + React + Tailwind + Supabase.
- [x] **Design System Base**: Componentes fundamentais (`Button`, `Card`, `Badge`, `DashboardUI`).
- [x] **Sincronização de Visão**: Dashboard e Kanban validados visualmente.

---

## 🏛️ 1. Backend (Supabase Foundations)
- [x] **Schema Core (v3)**: Tabelas fundamentais criadas.
    - `public.companies`, `public.deals`, `public.deal_checklist_items`, `public.deal_docs`, `public.messages`.
- [x] **View Operacional**: `v_deals_board` (Kanban + SLA).
- [x] **RBAC & Perfis**: Tabela `user_profiles` + Roles (MANAGER, OPERATOR, CLIENT).
- [x] **Multi-Tenancy**: Implementação de `tenant_id` (account_id) em todas as tabelas e RLS por tenant.
- [x] **Auditoria (Trigger-based)**: Tabela `events_audit` pronta para triggers.
- [x] **Views de Dashboard**: `v_dashboard_kpis` e `v_stage_stats` (Prontas para matar o hardcode).
- [x] **Seed de Desenvolvimento**: Função `seed_dev_data()` para popular 20 clientes.
- [x] **Gestão de Documentos**: Estrutura de Storage (buckets e RLS) + Tabela de docs.

---

## 🎨 2. Frontend (Vite/React)
- [x] **Overview (Dashboard)**: Tela de decisão baseada no Pipedrive.
    - Arquivo: `src/pages/app/Overview.tsx`
- [x] **Strategic Pipeline**: Kanban de 9 colunas funcional.
    - Arquivo: `src/pages/app/Pipeline.tsx`
- [x] **Drawer do Deal (MVP)**: Detalhamento lateral com abas.
    - Checklist, Docs, Mensagens e Auditoria.
    - Arquivo: `src/components/DealDrawer.tsx`
- [x] **Integração Front-end Storage**: Upload e visualização real de arquivos no Drawer.
    - Arquivo: `src/services/storageService.ts`
- [x] **Módulo de Mensagens (Inbox)**:
    - Central de atendimento com histórico completo e notas internas.
    - Arquivo: `src/pages/app/Inbox.tsx`
- [x] **Lista de Empresas**: Tabela detalhada com filtros.
    - Arquivo: `src/pages/app/Companies.tsx`
- [x] **Smoke Test**: Sistema de diagnóstico de integridade do banco de dados.
    - Arquivos: `src/services/smokeTest.ts`, `src/pages/app/Settings.tsx`

---

## 💸 3. Integrações & Operações
- [ ] **Fluxo de Pagamento**: Integração de Webhooks (PagBank/Mercado Pago).
    - Front-end: `src/pages/app/Payments.tsx`
- [x] **SOP Registro de Domínio**: Fluxo guiado para Registro.br.
    - Arquivo: `src/pages/app/IntegrationsSOP.tsx`
- [x] **SOP Registro de Marca**: Fluxo guiado para INPI.
    - Arquivo: `src/pages/app/IntegrationsSOP.tsx`

---

## 🛠️ Notas Técnicas & Localização
- **Supabase Project:** `nskecgwpdprzrowwawwb`
- **Queries Principais:** Todas as views começam with `v_`.
- **Estilo:** Baseado em `tokens.json` e Inter Font.
- **Economic Mode:** Limite de 2M tokens/dia ativo.

---

*Atualizado em: 2026-02-19*
