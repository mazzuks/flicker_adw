# Core Libraries

Este diretório contém as configurações principais e lógica de negócio compartilhada (hooks de autenticação, clientes de API, etc.).

## Arquivos

### `auth.tsx`
Provedor de contexto de autenticação (`AuthProvider`) e hook `useAuth`.
- **Estado Global:** Gerencia o usuário atual, seu perfil (`user_profiles`), as empresas às quais ele pertence (`client_memberships`) e o cliente selecionado no momento (`currentClientId`).
- **Funcionalidades:** `signIn`, `signUp`, `signOut`, e lógica de impersonação para administradores Adworks.
- **Ciclo de Vida:** Escuta mudanças no estado de autenticação do Supabase (`onAuthStateChange`) para manter o estado local sincronizado.

### `supabase.ts`
Configuração do cliente Supabase.
- **Funcionalidades:** Inicializa o cliente `createClient` utilizando variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
- **Tipagem:** Exporta o cliente com suporte a TypeScript para o schema do banco de dados (`Database`).
