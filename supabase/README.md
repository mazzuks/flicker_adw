# Supabase Backend

Configurações, migrações e lógica de backend utilizando a infraestrutura do Supabase.

## Estrutura

### `/migrations`
Contém os arquivos SQL de migração que definem o schema do banco de dados (tabelas, RLS, triggers, functions).
- **`full_schema.sql`**: Snapshot completo do schema.
- **`subscriptions_schema.sql`**: Definições relacionadas a planos e pagamentos.

### `/functions`
Edge Functions (Deno) para processamento server-side.
- **`cora-integration`**: Integração com o banco Cora.
- **`pagbank-webhook`**: Recebimento e processamento de notificações de pagamento do PagBank.
- **`send-email`**: Serviço de envio de e-mails transacionais.

### Scripts Ad-hoc
- `bypass_rls_test.sql`: Scripts para testes de segurança.
- `fix_my_user.sql`: Utilitários para correção de perfis de usuário durante o desenvolvimento.
