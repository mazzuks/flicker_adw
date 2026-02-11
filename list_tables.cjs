
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'db.nskecgwpdprzrowwawwb.supabase.co',
  database: 'postgres',
  password: 'Adworks2025?',
  port: 5432,
});

async function listTables() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log('Tables in public schema:');
  res.rows.forEach(row => console.log('- ' + row.table_name));
  await client.end();
}

listTables().catch(console.error);
