
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkRealAuth() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers(); // Provavelmente vai falhar sem service role
  console.log('Auth Users:', users || error?.message);
  
  const { data: profiles } = await supabase.from('user_profiles').select('*');
  console.log('Profiles:', profiles);
}

checkRealAuth();
