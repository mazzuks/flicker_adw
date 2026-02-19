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

---

## 🎨 2. Frontend (Vite/React)
- [x] **Overview (Dashboard)**: Tela de decisão baseada no Pipedrive.
    - Arquivo: `src/pages/app/Overview.tsx`
- [x] **Strategic Pipeline**: Kanban de 9 colunas funcional.
    - Arquivo: `src/pages/app/Pipeline.tsx`
- [ ] **Drawer do Deal (MVP)**: Detalhamento lateral com abas.
    - Checklist, Docs, Mensagens e Auditoria.
- [ ] **Módulo de Mensagens (Inbox)**:
    - Lista: `src/pages/app/Inbox.tsx`
    - Chat: `src/pages/app/InboxThread.tsx`
- [ ] **Lista de Empresas**: Tabela detalhada com filtros.
    - Arquivo: `src/pages/app/Companies.tsx`
- [ ] **Gestão de Documentos**: Upload real para o Storage do Supabase.

---

## 💸 3. Integrações & Operações
- [ ] **Fluxo de Pagamento**: Integração de Webhooks (PagBank/Mercado Pago).
- [ ] **SOP Registro de Domínio**: Fluxo guiado para Registro.br.
- [ ] **SOP Registro de Marca**: Fluxo guiado para INPI.

---

## 🛠️ Notas Técnicas & Localização
- **Supabase Project:** `nskecgwpdprzrowwawwb`
- **Queries Principais:** Todas as views começam com `v_`.
- **Estilo:** Baseado em `tokens.json` e Inter Font.
- **Economic Mode:** Limite de 2M tokens/dia ativo.

---

*Atualizado em: 2026-02-19*
