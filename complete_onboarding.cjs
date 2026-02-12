
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CLIENT_ID = '5b449cbb-fc8d-4e20-a786-15f32edbe2c7';

async function completeOnboarding() {
  console.log('🚀 Finalizando Onboarding via Backend...');

  const steps = [
    { 
      step_key: 'company_data', 
      status: 'APPROVED', 
      data_json: { 
        fantasy_name: 'Restaurante Sabor & Arte', 
        segment: 'food', 
        city: 'São Paulo', 
        state: 'SP' 
      } 
    },
    { 
      step_key: 'address', 
      status: 'APPROVED', 
      data_json: { 
        cep: '01310-100', 
        street: 'Avenida Paulista', 
        number: '1000', 
        neighborhood: 'Bela Vista' 
      } 
    },
    { 
      step_key: 'partners', 
      status: 'APPROVED', 
      data_json: { 
        partners: [
          { name: 'Dan Mazzucatto', cpf: '000.000.000-00', participation: '100' }
        ] 
      } 
    },
    { 
      step_key: 'activity', 
      status: 'APPROVED', 
      data_json: { 
        activity_description: 'Restaurante de comida contemporânea e artesanal.', 
        business_type: 'services' 
      } 
    },
    { 
      step_key: 'taxes', 
      status: 'APPROVED', 
      data_json: { 
        estimated_revenue: '20k_to_50k', 
        has_revenue: 'no' 
      } 
    },
    { 
      step_key: 'documents', 
      status: 'APPROVED', 
      data_json: { 
        status: 'all_files_verified' 
      } 
    },
    { step_key: 'certificate', status: 'APPROVED', data_json: { needs_certificate: 'yes' } },
    { step_key: 'domain', status: 'APPROVED', data_json: { domain_name: 'saborearte', domain_extension: '.com.br' } },
    { step_key: 'email', status: 'APPROVED', data_json: { email_provider: 'google', email_user: 'contato' } },
    { step_key: 'site', status: 'APPROVED', data_json: { wants_site: 'yes', site_template: 'modern' } },
    { step_key: 'brand', status: 'APPROVED', data_json: { wants_brand: 'yes', brand_name: 'Sabor & Arte' } },
    { step_key: 'crm', status: 'APPROVED', data_json: { lead_sources: ['Instagram', 'Google Ads'], expected_leads: '10_to_50' } }
  ];

  for (const step of steps) {
    const { error } = await supabase
      .from('onboarding_steps')
      .upsert({
        client_id: CLIENT_ID,
        step_key: step.step_key,
        status: step.status,
        data_json: step.data_json,
        updated_at: new Date().toISOString()
      }, { onConflict: 'client_id,step_key' });

    if (error) console.error(`Erro no passo ${step.step_key}:`, error.message);
    else console.log(`✅ Passo ${step.step_key} completado.`);
  }

  // Atualizar status da empresa para ACTIVE
  await supabase.from('clients').update({ status: 'ACTIVE' }).eq('id', CLIENT_ID);

  console.log('\n--- ONBOARDING 100% CONCLUÍDO ---');
}

completeOnboarding();
