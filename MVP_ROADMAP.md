# 🚀 MVP Roadmap - Adworks (Empresa Pronta)

Este arquivo e o nosso centro de comando para o desenvolvimento do MVP. Aqui monitoramos o progresso de cada funcionalidade, localizando onde estao as implementacoes no codigo e no banco de dados.

---

## 🏗️ 0. Checkpoint & Governanca
- [x] **Setup do Repositorio**: Base Vite + React + Tailwind + Supabase.
- [x] **Design System Base**: Componentes fundamentais (`Button`, `Card`, `Badge`, `DashboardUI`).
- [x] **Sincronizacao de Visao**: Dashboard e Kanban validados visualmente.

---

## 🏛️ 1. Backend (Supabase Foundations)
- [x] **Schema Core (v3)**: Tabelas fundamentais criadas.
    - `public.companies`, `public.deals`, `public.deal_checklist_items`, `public.deal_docs`, `public.messages`.
- [x] **View Operacional**: `v_deals_board` (Kanban + SLA).
- [x] **RBAC & Perfis**: Tabela `user_profiles` + Roles (MANAGER, OPERATOR, CLIENT).
- [x] **Multi-Tenancy**: Implementacao de `tenant_id` (account_id) em todas as tabelas e RLS por tenant.
- [x] **Auditoria (Trigger-based)**: Tabela `events_audit` pronta para triggers.
- [x] **Views de Dashboard**: `v_dashboard_kpis` e `v_stage_stats` (Prontas para matar o hardcode).
- [x] **Seed de Desenvolvimento**: Funcao `seed_dev_data()` para popular 20 clientes.
- [x] **Gestao de Documentos**: Estrutura de Storage (buckets e RLS) + Tabela de docs.

---

## 🎨 2. Frontend (Vite/React)
- [x] **Overview (Dashboard)**: Tela de decisao baseada no Pipedrive.
    - Arquivo: `src/pages/app/Overview.tsx`
- [x] **Strategic Pipeline**: Kanban de 9 colunas funcional.
    - Arquivo: `src/pages/app/Pipeline.tsx`
- [x] **Drawer do Deal (MVP)**: Detalhamento lateral com abas.
    - Checklist, Docs, Mensagens e Auditoria.
    - Arquivo: `src/components/DealDrawer.tsx`
- [x] **Integracao Front-end Storage**: Upload e visualizacao real de arquivos no Drawer.
    - Arquivo: `src/services/storageService.ts`
- [x] **Modulo de Mensagens (Inbox)**:
    - Central de atendimento com historico completo e notas internas.
    - Arquivo: `src/pages/app/Inbox.tsx`
- [x] **Lista de Empresas**: Tabela detalhada com filtros.
    - Arquivo: `src/pages/app/Companies.tsx`
- [x] **Smoke Test**: Sistema de diagnostico de integridade do banco de dados.
    - Arquivos: `src/services/smokeTest.ts`, `src/pages/app/Settings.tsx`
- [x] **Code Splitting & Performance**: Implementacao de lazy loading para rotas pesadas.
    - Arquivo: `src/App.tsx`

---

## 💸 3. Integracoes & Operacoes
- [x] **Fluxo de Pagamento**: Estrutura de Invoices, Webhooks e Ativacao Automatica de Tenant.
    - Arquivo: `src/pages/app/Payments.tsx`
- [x] **SOP Registro de Dominio**: Fluxo guiado para Registro.br.
    - Arquivo: `src/pages/app/IntegrationsSOP.tsx`
- [x] **SOP Registro de Marca**: Fluxo guiado para INPI.
    - Arquivo: `src/pages/app/IntegrationsSOP.tsx`

---

## 🪄 4. Templeteria (Site Builder IA)
- [x] **Infraestrutura de Site**: Migration de tabelas e schema declarativo unificado.
    - Arquivo: `supabase/migrations/20260223_templeteria_unification.sql`
- [x] **Wizard de Criacao (UX)**: Formulario de 12 etapas com motor de progresso real.
    - Arquivo: `src/pages/app/TempleteriaWizard.tsx`
- [x] **Motor de Renderizacao**: Componente que transforma JSON em secoes visuais com contrato v1.
    - Arquivo: `src/components/templeteria/SiteRenderer.tsx`
- [x] **Refino de Projeto (Editor)**: Interface com historico de versoes e preview Desktop/Mobile.
    - Arquivo: `src/pages/app/TempleteriaRefiner.tsx`
- [x] **Geracao e Refino IA**: Integracao real com Gemini 1.5-Flash (Edge Functions).
    - Arquivo: `src/services/templeteriaEngine.ts`

---

## 📅 5. Modulo Contabil & Fiscal
- [x] **Checklist Contabil**: Tabela e UI de acompanhamento de setup (CNAE, Certificado, etc).
    - Arquivos: `supabase/migrations/20260223_fiscal_and_checklist.sql`, `src/pages/app/AccountChecklist.tsx`
- [x] **Agenda Fiscal**: Central de vencimentos (DAS, Pro-labore) com calendario visual.
    - Arquivos: `src/pages/app/FiscalAgenda.tsx`, `supabase/functions/fiscal-cron/index.ts`
- [x] **Solicitador de Nota Fiscal**: Formulario para pedido de emissao (CNPJ, Valor, Descricao).
    - Arquivos: `supabase/migrations/20260223_fiscal_motor_2_0.sql`, `src/pages/app/NfSolicitator.tsx`, `src/pages/app/FiscalOperatorQueue.tsx`
- [x] **Gerador de DAS**: Upload e disponibilizacao manual da guia mensal com Storage isolado.
    - Arquivos: `supabase/migrations/20260223_fiscal_das_5_0.sql`, `src/pages/app/CompanyDas.tsx`, `src/pages/app/OperatorDasManager.tsx`
- [x] **Dashboard Financeiro Simplificado**: Resumo de faturamento e impostos.
    - Arquivos: `supabase/migrations/20260223_fiscal_dashboard_3_0.sql`, `src/pages/app/CompanyFinance.tsx`, `src/pages/app/OperatorFinanceEditor.tsx`
- [x] **Admin BI**: Dashboard de saude do produto (MRR, Churn, ARPU).
    - Arquivos: `supabase/migrations/20260223_product_finance_admin.sql`, `src/pages/app/AdminFinanceBI.tsx`

---

## 🛠️ Notas Tecnicas & Localizacao
- **Supabase Project:** `nskecgwpdprzrowwawwb`
- **Queries Principais:** Todas as views comecam com `v_`.
- **Estilo:** Baseado em `tokens.json` e Inter Font. Sem emojis no codigo.

---

*Atualizado em: 2026-02-23*
