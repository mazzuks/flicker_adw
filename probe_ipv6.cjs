
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: '2600:1f18:2e13:9d3b:963d:f892:37c7:84f2',
  database: 'postgres',
  password: 'Adworks2025?',
  port: 5432,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected!');
    
    const res = await client.query(`
      SELECT nspname as schema_name, relname as table_name
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'extensions')
      AND c.relkind = 'r'
      ORDER BY nspname, relname;
    `);
    
    console.log('Tables:');
    res.rows.forEach(row => console.log(`- ${row.schema_name}.${row.table_name}`));
    
    await client.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
