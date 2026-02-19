import { createClient } from '@supabase/supabase-js';

// Usando as credenciais reais do projeto encontradas no .env
const supabaseUrl = 'https://nskecgwpdprzrowwawwb.supabase.co';
const supabaseKey = 'sb_publishable__bjFxTlZaOHStTzFDvpxNw_R7yY-9xt';
const supabase = createClient(supabaseUrl, supabaseKey);

async function smokeTest() {
  const tables = [
    'companies',
    'deals',
    'deal_checklist_items',
    'deal_docs',
    'messages_threads',
    'messages'
  ];

  console.log('--- DB SMOKE TEST (REAL CREDENTIALS) ---');
  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.error(`❌ Table [${table}]: ${error.message} (${error.code})`);
      } else {
        console.log(`✅ Table [${table}]: ${count} records`);
      }
    } catch (e: any) {
      console.error(`💥 Table [${table}]: Runtime Error - ${e.message}`);
    }
  }
}

smokeTest();
