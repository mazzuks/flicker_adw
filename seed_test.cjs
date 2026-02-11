
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt'; // Usando a anon key fornecida
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedTestData() {
  console.log('Iniciando criação de dados de teste...');

  // 1. Criar uma Empresa (Client)
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert([
      {
        name: 'Restaurante Sabor & Arte',
        slug: 'sabor-arte-' + Math.floor(Math.random() * 1000),
        plan: 'PREMIUM',
        status: 'ONBOARDING',
        fantasy_name: 'Sabor & Arte Gastronomia',
        city: 'São Paulo',
        state: 'SP'
      }
    ])
    .select()
    .single();

  if (clientError) {
    console.error('Erro ao criar cliente:', clientError.message);
    return;
  }
  console.log('✅ Cliente criado:', client.name);

  // 2. Criar passos do Onboarding
  const steps = [
    { client_id: client.id, step_key: 'company_data', status: 'APPROVED', data_json: { name: 'Sabor & Arte' } },
    { client_id: client.id, step_key: 'address', status: 'APPROVED', data_json: { street: 'Av. Paulista, 1000' } },
    { client_id: client.id, step_key: 'partners', status: 'IN_PROGRESS', data_json: { partners: [{ name: 'Dan Mazzucatto' }] } },
    { client_id: client.id, step_key: 'activity', status: 'NOT_STARTED', data_json: {} },
    { client_id: client.id, step_key: 'taxes', status: 'NOT_STARTED', data_json: {} },
    { client_id: client.id, step_key: 'documents', status: 'NEEDS_FIX', data_json: {} }
  ];

  const { error: stepsError } = await supabase.from('onboarding_steps').insert(steps);
  if (stepsError) console.error('Erro ao criar passos:', stepsError.message);
  else console.log('✅ Passos do onboarding inicializados.');

  // 3. Criar um Ticket de exemplo
  const { error: ticketError } = await supabase.from('tickets').insert([
    {
      client_id: client.id,
      type: 'TICKET_CNPJ',
      status: 'WAITING_CLIENT',
      priority: 'HIGH',
      sla_due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      data_json: { note: 'Aguardando envio do RG do sócio majoritário.' }
    }
  ]);
  if (ticketError) console.error('Erro ao criar ticket:', ticketError.message);
  else console.log('✅ Ticket de teste criado.');

  console.log('\n--- TUDO PRONTO ---');
  console.log('ID do Cliente para teste:', client.id);
  console.log('Dica: Agora você precisa associar seu usuário a este client_id na tabela client_memberships.');
}

seedTestData();
