
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nskecgwpdprzrowwawwb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TARGET_CLIENT_ID = '5b449cbb-fc8d-4e20-a786-15f32edbe2c7';

async function fixMessages() {
  console.log('Finalizando preenchimento de mensagens...');

  // Pegar o ID do seu usuário real para ser o autor
  const { data: profile } = await supabase.from('user_profiles').select('id').limit(1).single();
  
  if (!profile) {
     console.error('Nenhum perfil encontrado no banco. Por favor, cadastre-se primeiro.');
     return;
  }

  const { data: ticket } = await supabase.from('tickets').select('id').eq('client_id', TARGET_CLIENT_ID).limit(1).single();
  
  if (ticket) {
    const messages = [
      { 
        ticket_id: ticket.id, 
        author_user_id: profile.id, 
        message: 'Olá Dan! Recebemos seus documentos. O processo de abertura do CNPJ está em 40% concluído.', 
        visibility: 'CLIENT' 
      },
      { 
        ticket_id: ticket.id, 
        author_user_id: profile.id, 
        message: 'Se precisar de ajuda com a escolha do regime tributário, é só chamar por aqui.', 
        visibility: 'CLIENT' 
      }
    ];
    
    const { error } = await supabase.from('ticket_messages').insert(messages);
    if (!error) console.log('✅ Inbox preenchido com sucesso!');
    else console.error('Erro ao inserir mensagens:', error.message);
  }
}

fixMessages();
