# Adworks - Empresa Pronta

Plataforma SaaS multi-tenant para gestão completa de novas empresas, desde a abertura do CNPJ até a gestão de leads e clientes.

## Funcionalidades Implementadas (MVP)

### Autenticação e Multi-tenant
- Sistema de login e registro
- Autenticação com Supabase
- RBAC (Role-Based Access Control) com 7 perfis diferentes
- Isolamento total de dados por cliente (client_id)
- Suporte para múltiplos usuários por empresa

### Dashboard do Cliente
- Barra de progresso visual mostrando conclusão do cadastro
- Cards de status para CNPJ, Marca, Domínio e Email
- Próximas ações destacadas
- Timeline de acompanhamento
- Interface intuitiva e responsiva

### Onboarding Wizard
- Fluxo guiado em 12 etapas
- Interface conversacional (1 pergunta por vez)
- Progresso visual em tempo real
- Navegação entre etapas
- Salvamento automático
- Estados: NOT_STARTED, IN_PROGRESS, SUBMITTED, NEEDS_FIX, APPROVED

### CRM Completo
- Pipeline Kanban com 6 estágios (Novo, Contato, Qualificado, Proposta, Fechado, Perdido)
- Drag & drop entre estágios
- Busca e filtros
- Criação rápida de leads
- Resumo e métricas
- Atividade recente
- Campos customizáveis

### Formulários Públicos
- Captura de leads via URLs públicas (/f/:clientSlug/:formId)
- Formulários customizáveis por cliente
- Rate limiting e segurança
- Página de sucesso após envio
- Isolamento total entre clientes

### Sistema de Documentos
- Upload de documentos com Supabase Storage
- Categorias predefinidas (RG, CPF, comprovante de residência, etc.)
- Validação de documentos por operadores
- Estados: RECEIVED, INVALID, APPROVED
- Comentários em documentos para feedback ao cliente
- Interface de reenvio facilitada
- Visualização de status e histórico

### Sistema de Tarefas (Cliente)
- Lista centralizada de tarefas pendentes
- Documentos inválidos que precisam ser reenviados
- Etapas do onboarding não concluídas
- Tickets aguardando resposta do cliente
- Priorização automática (urgente, normal, baixa)
- Botões de ação direta ("Enviar agora", "Continuar", etc.)
- Indicadores de prazo (SLA)

### Inbox e Mensageria
- Sistema de chat por ticket
- Conversas separadas por tipo (CNPJ, INPI, Fiscal)
- Mensagens com visibilidade CLIENT ou INTERNAL
- Interface estilo chat moderno
- Histórico completo de conversas
- Envio de mensagens em tempo real
- Indicadores de status do ticket

### Central de Notificações
- Sino funcional com contador de não lidas
- Notificações in-app em tempo real
- Tipos: DOC_REQUIRED, DOC_APPROVED, MESSAGE_RECEIVED, STATUS_CHANGED
- Marcação individual ou em massa como lida
- Navegação direta para o contexto da notificação
- Atualização automática via subscriptions
- Histórico de notificações

### Sistema de Tickets (Backoffice)
- Interface completa para gestão de tickets CNPJ
- Interface para tickets INPI
- Dashboard com KPIs e métricas
- Filtros por status (Novo, Em Andamento, Aguardando Cliente, Concluído)
- Atribuição de operadores
- Tracking de SLA com alertas de atraso
- Timeline de eventos por ticket
- Priorização (LOW, NORMAL, HIGH, URGENT)

### Dashboard Adworks
- Visão geral de operações
- KPIs: clientes ativos, total de tickets, em andamento, concluídos
- Alertas de tickets atrasados (SLA vencido)
- Status consolidado dos tickets
- Ações rápidas para navegação
- Métricas mensais

### PWA (Progressive Web App)
- Manifest configurado
- Instalável em dispositivos móveis
- Modo standalone
- Theme color configurado
- Preparado para web push notifications

### Segurança
- Row Level Security (RLS) em todas as tabelas
- Políticas restritivas por padrão
- Auditoria de ações críticas
- Isolamento total de dados por cliente
- Sanitização de inputs

## Estrutura do Banco de Dados

### Tabelas Principais
- **user_profiles**: Perfis de usuários com role global
- **clients**: Empresas (tenants)
- **client_memberships**: Relacionamento usuário-empresa
- **onboarding_steps**: Progresso do wizard
- **documents**: Arquivos e documentos
- **document_comments**: Feedback sobre documentos
- **tickets**: Sistema de trabalho interno
- **ticket_checklist**: Tarefas por ticket
- **ticket_messages**: Chat interno por ticket
- **notifications**: Central de notificações
- **notification_preferences**: Preferências de notificação
- **domains**: Gestão de domínios
- **bank_accounts**: Contas bancárias (Cora)
- **email_accounts**: Emails corporativos
- **sites**: Website builder
- **forms**: Formulários de captura
- **leads**: CRM - leads e clientes
- **lead_notes**: Anotações sobre leads
- **fiscal_reports**: Relatórios fiscais
- **audit_logs**: Log de auditoria

## Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Build**: Vite

## Estrutura de Pastas

```
src/
├── lib/
│   ├── supabase.ts                # Cliente Supabase
│   └── auth.tsx                   # Context de autenticação
├── types/
│   └── database.ts                # TypeScript types
├── components/
│   ├── Layout.tsx                 # Layout principal
│   ├── PrivateRoute.tsx           # Proteção de rotas
│   ├── DocumentUpload.tsx         # Upload de documentos
│   └── NotificationCenter.tsx     # Central de notificações
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── client/
│   │   ├── Dashboard.tsx          # Dashboard do cliente
│   │   ├── Onboarding.tsx         # Wizard de cadastro
│   │   ├── Documents.tsx          # Gestão de documentos
│   │   ├── Tasks.tsx              # Tarefas pendentes
│   │   ├── Inbox.tsx              # Mensagens e chat
│   │   └── CRM.tsx                # Gestão de leads
│   ├── adworks/
│   │   ├── AdworksDashboard.tsx   # Dashboard backoffice
│   │   └── TicketsCNPJ.tsx        # Gestão de tickets CNPJ
│   └── public/
│       └── LeadForm.tsx           # Formulário público
└── App.tsx                        # Rotas principais
```

## Roles e Permissões

### Adworks (Backoffice)
- **ADWORKS_SUPERADMIN**: Acesso total, configurações, auditoria
- **ADWORKS_ADMIN**: Operações gerais
- **ADWORKS_ACCOUNT_MANAGER**: Gestão de clientes e métricas
- **OPERATOR_ACCOUNTING**: Fila CNPJ e fiscal
- **OPERATOR_INPI**: Fila INPI/marca

### Cliente
- **CLIENT_OWNER**: Dono da empresa, controle total
- **CLIENT_USER**: Usuário padrão
- **CLIENT_VIEWER**: Apenas visualização

## Como Usar

1. Registre-se em `/register`
2. Automaticamente será criado:
   - Perfil de usuário
   - Nova empresa (client)
   - Membership como CLIENT_OWNER
3. Acesse o dashboard e inicie o onboarding
4. Preencha as etapas do wizard
5. Gerencie leads no CRM
6. Crie formulários públicos para captura

## Status de Implementação

### ✅ Implementado (MVP)
- [x] Sistema de upload de documentos
- [x] Sistema completo de tickets com SLA
- [x] Inbox e chat por ticket
- [x] Notificações in-app em tempo real
- [x] Dashboard Adworks (backoffice)
- [x] Central de tarefas para clientes
- [x] Gestão de leads (CRM completo)
- [x] Formulários públicos de captura
- [x] Onboarding wizard conversacional
- [x] Multi-tenant com RLS

### 🚧 Próximos Passos (Fase 2)
- [ ] Completar todos os formulários do onboarding wizard
- [ ] Notificações por email (SMTP)
- [ ] Integração real com domínios (Registro.br/Reseller)
- [ ] Site builder com templates
- [ ] Notificações web push
- [ ] Integração Cora (conta PJ)
- [ ] Provisionamento Google Workspace/Microsoft 365
- [ ] Billing e pagamentos
- [ ] Emissão de NF
- [ ] Relatórios fiscais automáticos
- [ ] Gatilhos automáticos (criar tickets ao completar onboarding)
- [ ] Sistema de auditoria expandido

## Build e Deploy

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Variáveis de Ambiente

Crie um arquivo `.env` com:

```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

## Suporte

Para dúvidas ou suporte, entre em contato com a equipe Adworks.
