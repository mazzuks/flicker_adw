# Demanda – Seed Dev Data + Dashboard

## O que foi feito
- [x] Migration exclusiva de seed criada (`supabase/migrations/20260219_seed_dev_data.sql`)
- [x] Função `seed_dev_data` registrada corretamente no Supabase RPC
- [x] Permissão `GRANT EXECUTE` configurada para usuários autenticados
- [x] Frontend atualizado para chamar o RPC real com tratamento de erro
- [x] Lógica de KPIs no `queries.ts` corrigida para refletir dados reais
- [x] Overview preparada para dados do banco (sem mocks no código)
- [x] Pipeline populado com 9 etapas e cards dinâmicos

## Arquivos alterados
- `supabase/migrations/20260219_seed_dev_data.sql`
- `src/pages/app/Settings.tsx`
- `src/lib/queries.ts`
- `demanda.md`

## Como testar
1. Aplique a nova migration no SQL Editor do Supabase.
2. Abra a aplicação em `/app/settings`.
3. Clique em **"SEED DEV DATA (20 CLIENTES)"**.
4. Verifique as páginas **Overview** e **Pipeline** para ver os dados reais.
