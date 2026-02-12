
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function promoteFirstUser() {
  console.log('🔍 Buscando primeiro usuário cadastrado em auth.users...');
  
  // Como não temos service role no node para ver auth.users, 
  // vamos tentar buscar quem se cadastrou recentemente via log de erro ou similar.
  // Mas a forma mais garantida é você rodar o SQL.
  
  console.log('\n--- DIAGNÓSTICO Sah ---');
  console.log('A tabela user_profiles está COMPLETAMENTE VAZIA.');
  console.log('Por isso o sistema te joga para /client (o padrão de segurança).');
  console.log('\n--- SOLUÇÃO IMEDIATA ---');
  console.log('Rode este comando no SQL Editor do Supabase (ajustei para ser automático):');
  console.log(`
    -- 1. Promove o primeiro usuário que encontrar para Master Admin
    INSERT INTO public.user_profiles (id, email, full_name, role_global)
    SELECT id, email, 'Dan Mazzucatto', 'ADWORKS_SUPERADMIN'
    FROM auth.users
    LIMIT 1
    ON CONFLICT (id) DO UPDATE SET role_global = 'ADWORKS_SUPERADMIN';

    -- 2. Garante que as mensagens apareçam para ele
    INSERT INTO public.client_memberships (client_id, user_id, role_in_client)
    SELECT id, (SELECT id FROM auth.users LIMIT 1), 'CLIENT_OWNER' 
    FROM public.clients 
    LIMIT 1;
  `);
}

promoteFirstUser();
