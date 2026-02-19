# Components

Este diretório contém componentes React reutilizáveis utilizados em todo o sistema Adworks.

## Arquivos

### `DocumentUpload.tsx`

Componente responsável pelo upload de documentos para o Supabase Storage.

- **Funcionalidades:** Seleção de arquivos, upload para o bucket `documents`, salvamento de metadados na tabela `documents` e exibição do status do documento (Aprovado, Em análise, Reenviar necessário).
- **Integração:** Utiliza o hook `useAuth` para identificar o cliente atual e o cliente Supabase para operações de storage e banco de dados.

### `Layout.tsx`

Componente de layout principal que envolve as páginas protegidas.

- **Funcionalidades:** Renderiza a barra de navegação superior, o menu lateral (ou abas superiores para administradores) e o rodapé mobile.
- **Impersonação:** Inclui lógica para o "Modo Visualização", onde um administrador da Adworks pode visualizar o sistema como se fosse um cliente específico.
- **Navegação:** Define os itens de menu dinamicamente com base no papel do usuário (`isAdworks`).

### `NotificationCenter.tsx`

Componente de central de notificações.

- **Funcionalidades:** Exibe uma lista de notificações em tempo real usando Supabase Realtime. Permite marcar notificações como lidas e redirecionar o usuário para a entidade relacionada (Ticket, Documento, etc.).
- **Integração:** Escuta mudanças na tabela `notifications` filtradas pelo `user_id` do usuário logado.

### `PrivateRoute.tsx`

Componente de alta ordem (HOC) para proteção de rotas.

- **Funcionalidades:** Verifica se o usuário está autenticado e se possui as permissões necessárias para acessar uma rota específica.
- **Permissões:** Suporta a flag `requireAdworks` para restringir o acesso apenas a membros da equipe Adworks.
