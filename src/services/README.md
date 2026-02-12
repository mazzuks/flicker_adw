# Services

Este diretório é destinado a serviços de API externos e abstrações de lógica de dados que não pertencem diretamente aos hooks ou componentes.

Atualmente, a maior parte da lógica está integrada via Supabase diretamente no `src/lib` e hooks, mas este espaço deve ser utilizado para:
- Integrações com APIs de terceiros.
- Classes de serviço complexas.
- Utilitários de transformação de dados globais.
