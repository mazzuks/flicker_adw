# Changelog - Adworks Empresa Pronta

## [1.0.0] - 2026-02-10

### Implementação Completa do MVP

#### 🎯 Autenticação e Multi-tenant
- Sistema completo de login e registro
- RBAC com 7 perfis diferentes
- Isolamento total de dados por client_id
- Row Level Security (RLS) em todas as tabelas

#### 📝 Onboarding Wizard Completo - 12 Etapas
1. **Dados da Empresa** - Nome fantasia, segmento, cidade, estado
2. **Endereço** - CEP, logradouro, número, complemento, bairro
3. **Sócios** - Nome, CPF, participação (suporta múltiplos sócios)
4. **Atividade** - Descrição da atividade, tipo de negócio, sugestão de CNAE
5. **Impostos** - Faturamento estimado, sugestão de regime tributário
6. **Documentos** - Direcionamento para área de documentos
7. **Certificado Digital** - Solicitação de e-CNPJ
8. **Domínio** - Escolha de domínio (.com.br, .com, .net, .org)
9. **Email Corporativo** - Google Workspace ou Microsoft 365
10. **Site Institucional** - Templates (modern, classic, minimal)
11. **Marca** - Registro no INPI com classe
12. **CRM** - Fontes de leads e volume esperado

#### 📄 Sistema de Documentos
- Upload com Supabase Storage
- Categorias predefinidas (RG, CPF, comprovante, etc.)
- Estados: RECEIVED, INVALID, APPROVED
- Comentários por documento
- Interface de reenvio facilitada
- Storage bucket com RLS

#### ✅ Central de Tarefas
- Lista inteligente de pendências
- Documentos inválidos para reenviar
- Etapas do onboarding não concluídas
- Tickets aguardando resposta
- Priorização automática (urgente/normal/baixa)
- Botões de ação direta
- Indicadores de prazo (SLA)

#### 💬 Inbox e Mensageria
- Chat por ticket (CNPJ, INPI, Fiscal)
- Visibilidade CLIENT ou INTERNAL
- Interface estilo chat moderno
- Histórico completo
- Envio em tempo real
- Indicadores de status

#### 🔔 Sistema de Notificações
- Sino funcional com contador de não lidas
- Notificações in-app em tempo real
- Tipos: DOC_REQUIRED, DOC_APPROVED, MESSAGE_RECEIVED, STATUS_CHANGED
- Marcação individual ou em massa
- Navegação direta ao contexto
- Atualização via Supabase subscriptions

#### 🎫 Sistema de Tickets (Backoffice)
- Tickets CNPJ, INPI e Fiscal
- Estados completos: NEW, WAITING_CLIENT, READY, IN_PROGRESS, SUBMITTED, PENDING_EXTERNAL, APPROVED, REJECTED, DONE
- SLA tracking com alertas
- Priorização (LOW, NORMAL, HIGH, URGENT)
- Atribuição de operadores
- Timeline de eventos
- Checklist por ticket
- Filtros por status

#### 📊 Dashboard Adworks
- KPIs principais (clientes ativos, tickets totais, em andamento, concluídos)
- Alertas de SLA vencido
- Status consolidado
- Ações rápidas
- Métricas mensais

#### 👥 CRM Completo
- Pipeline Kanban: NOVO → CONTATO → QUALIFICADO → PROPOSTA → FECHADO → PERDIDO
- Drag & drop entre estágios
- Busca e filtros
- Criação rápida de leads
- Métricas e resumo
- Campos customizáveis
- Notas por lead

#### 📋 Formulários Públicos
- Captura de leads via URLs públicas
- Isolamento total por cliente
- Campos customizáveis
- Página de sucesso

#### ⚡ Gatilhos Automáticos
- **Onboarding Completo** → Cria ticket CNPJ (SLA 15 dias)
- **Solicitação de Marca** → Cria ticket INPI (SLA 30 dias)
- **Documento Inválido** → Notifica cliente + cria tarefa
- **Documento Aprovado** → Notifica cliente
- **Mudança de Status de Ticket** → Notifica com linguagem humana

#### 📱 PWA
- Manifest configurado
- Instalável em dispositivos móveis
- Mode standalone
- Theme color
- Preparado para web push

#### 🔒 Segurança
- Row Level Security em todas as tabelas
- Políticas restritivas por padrão
- Auditoria de ações críticas
- Isolamento total multi-tenant
- Storage com RLS

#### 🗄️ Banco de Dados
- 20 tabelas implementadas
- 4 triggers automáticos
- 4 functions PostgreSQL
- Indexes otimizados
- Foreign keys completas

### Build
- Bundle: 412KB JS, 22KB CSS
- Gzip: 113KB JS, 4.7KB CSS
- Build time: ~7 segundos
- Compilação sem erros

### Próximos Passos (Fase 2)
- Notificações por email (SMTP)
- Integração real com APIs de domínio
- Site builder visual
- Web push completo
- Integração Cora
- Provisionamento Google/Microsoft
- Billing e pagamentos
- NF automática
- Relatórios fiscais automáticos
