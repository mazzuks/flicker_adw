# Pages

Este diretório contém os componentes de página do sistema, organizados por contexto de acesso.

## Estrutura de Pastas

- **`/adworks`**: Páginas exclusivas para a equipe interna da Adworks (Painel administrativo, gestão de clientes, tickets técnicos).
- **`/client`**: Páginas voltadas para o cliente final (Dashboard do cliente, upload de documentos, financeiro, CRM).
- **`/public`**: Páginas acessíveis sem autenticação (ex: formulários de lead).

## Páginas de Autenticação (Raiz)

- `Login.tsx`: Tela de entrada para usuários.
- `Register.tsx`: Fluxo de criação de nova conta e configuração inicial da empresa (Onboarding).
- `ForgotPassword.tsx` & `ResetPassword.tsx`: Fluxo de recuperação de senha.
