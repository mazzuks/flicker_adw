
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixUser() {
  // 1. Tentar pegar o usuário logado via sessão ativa (se houver no node, improvável)
  // Como não temos o ID, vamos criar uma profile para o primeiro usuário que se cadastrar
  // ou permitir que o usuário logado crie sua própria profile.

  console.log('Verificando tabelas vazias...');
  
  const { data: clients } = await supabase.from('clients').select('id, name');
  console.log('Empresas disponíveis:', clients);

  console.log('\n--- ATENÇÃO DAN ---');
  console.log('As tabelas user_profiles e client_memberships estão VAZIAS.');
  console.log('É por isso que as telas de Tarefas, Mensagens e CRM aparecem em branco.');
  console.log('O sistema não sabe a qual empresa o seu usuário pertence.');
  console.log('\n--- COMO RESOLVER ---');
  console.log('1. Vá no painel do Supabase -> Table Editor -> user_profiles.');
  console.log('2. Crie uma linha com o seu ID de usuário (pegue em Auth -> Users) e seu e-mail.');
  console.log('3. Defina a role_global como ADWORKS_SUPERADMIN.');
  console.log('4. Vá em client_memberships e crie um vínculo entre o seu ID e o ID da empresa: ' + (clients?.[0]?.id || 'Nenhum cliente cadastrado'));
}

fixUser();
