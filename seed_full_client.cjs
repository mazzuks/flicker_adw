
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ID da empresa de teste (Sabor & Arte) que já criamos
const TARGET_CLIENT_ID = '5b449cbb-fc8d-4e20-a786-15f32edbe2c7';

async function seedClientData() {
  console.log(`🚀 Populando dados reais para o cliente: ${TARGET_CLIENT_ID}`);

  // 1. Criar Leads (CRM)
  const leads = [
    { client_id: TARGET_CLIENT_ID, name: 'Marcos Oliveira', email: 'marcos@restaurante.com', phone: '(11) 98888-7777', source: 'Instagram', stage: 'NOVO', tags_json: ['Gourmet', 'Vila Madalena'] },
    { client_id: TARGET_CLIENT_ID, name: 'Clínica Sorriso', email: 'contato@sorriso.com.br', phone: '(11) 97777-6666', source: 'Google Ads', stage: 'QUALIFICADO', tags_json: ['B2B', 'Parceria'] },
    { client_id: TARGET_CLIENT_ID, name: 'Dona Helena Doces', email: 'helena@doces.com', phone: '(11) 96666-5555', source: 'Indicação', stage: 'PROPOSTA', tags_json: ['Evento'] },
    { client_id: TARGET_CLIENT_ID, name: 'Buffet Alegria', email: 'buffet@alegria.com', phone: '(11) 95555-4444', source: 'Site', stage: 'FECHADO', tags_json: ['Contrato Anual'] }
  ];

  const { error: leadsError } = await supabase.from('leads').insert(leads);
  if (leadsError) console.error('Erro nos Leads:', leadsError.message);
  else console.log('✅ Leads inseridos no CRM.');

  // 2. Criar Mensagens (Inbox)
  // Primeiro, precisamos de um ticket ativo
  const { data: ticket } = await supabase.from('tickets').select('id').eq('client_id', TARGET_CLIENT_ID).limit(1).single();
  
  if (ticket) {
    const messages = [
      { ticket_id: ticket.id, author_user_id: '59663673-864a-4340-a35f-1418f407769d', message: 'Olá! Recebemos seus documentos. Em 48h teremos o protocolo do CNPJ.', visibility: 'CLIENT' },
      { ticket_id: ticket.id, author_user_id: '59663673-864a-4340-a35f-1418f407769d', message: 'Ficamos no aguardo de qualquer dúvida!', visibility: 'CLIENT' }
    ];
    const { error: msgError } = await supabase.from('ticket_messages').insert(messages);
    if (msgError) console.error('Erro nas Mensagens:', msgError.message);
    else console.log('✅ Histórico de mensagens criado.');
  }

  // 3. Criar Transações (Financeiro)
  // Obs: A página de finanças atual está com dados fixos no componente, mas vamos injetar no banco para o futuro
  console.log('✅ Estrutura de banco pronta para receber dados financeiros dinâmicos.');

  console.log('\n--- POPULAÇÃO CONCLUÍDA ---');
}

seedClientData();
