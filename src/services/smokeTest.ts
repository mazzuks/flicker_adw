import { supabase } from '../lib/supabase';

/**
 * 🚀 ADWORKS SMOKE TEST (v1)
 * Valida a integridade do banco de dados para garantir que o MVP está operante.
 */

export async function runSmokeTest() {
  const results = {
    tables: false,
    views: false,
    rpc: false,
    rls: false,
    errors: [] as string[],
  };

  try {
    // 1. Validar Tabelas Core
    const { error: tableError } = await supabase.from('companies').select('id').limit(1);
    if (tableError) results.errors.push(`Tabela Companies: ${tableError.message}`);
    else results.tables = true;

    // 2. Validar Views (Dashboard)
    const { error: viewError } = await supabase.from('v_deals_board').select('*').limit(1);
    if (viewError) results.errors.push(`View Deals Board: ${viewError.message}`);
    else results.views = true;

    // 3. Validar RPC (Seed)
    const { data: rpcData, error: rpcError } = await supabase.rpc('seed_dev_data');
    if (rpcError && !rpcError.message.includes('authenticated')) {
      results.errors.push(`RPC Seed: ${rpcError.message}`);
    } else {
      results.rpc = true;
    }

    // 4. Validar User Profile (RBAC)
    const { error: profileError } = await supabase.from('user_profiles').select('id').limit(1);
    if (profileError && !profileError.message.includes('row-level security')) {
      results.errors.push(`RBAC Profile: ${profileError.message}`);
    } else {
      results.rls = true;
    }
  } catch (e: any) {
    results.errors.push(`Erro fatal no teste: ${e.message}`);
  }

  return results;
}
