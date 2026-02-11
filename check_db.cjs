
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase.from('user_profiles').select('*').limit(1);
  if (error) {
    console.log('Error or Table Missing:', error.message);
  } else {
    console.log('Table user_profiles exists. Data:', data);
  }
}

check();
