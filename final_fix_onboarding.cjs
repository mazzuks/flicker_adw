
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CLIENT_ID = '5b449cbb-fc8d-4e20-a786-15f32edbe2c7';

async function finalFixOnboarding() {
  console.log('🏁 Forçando aprovação total dos passos...');

  const { data: steps } = await supabase
    .from('onboarding_steps')
    .select('id, step_key, status')
    .eq('client_id', CLIENT_ID);

  for (const step of (steps || [])) {
    if (step.status !== 'APPROVED') {
       const { error } = await supabase
        .from('onboarding_steps')
        .update({ status: 'APPROVED' })
        .eq('id', step.id);
       
       if (!error) console.log(`✅ ${step.step_key} -> APPROVED`);
    }
  }

  // Criar tickets reais para aparecerem no acompanhamento
  await supabase.from('tickets').insert([
    { client_id: CLIENT_ID, type: 'TICKET_CNPJ', status: 'IN_PROGRESS', priority: 'NORMAL' },
    { client_id: CLIENT_ID, type: 'TICKET_INPI', status: 'NEW', priority: 'LOW' }
  ]);

  console.log('🚀 Tickets de acompanhamento criados.');
}

finalFixOnboarding();
