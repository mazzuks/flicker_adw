
const dns = require('dns');
const { Client } = require('pg');

dns.lookup('db.nskecgwpdprzrowwawwb.supabase.co', { family: 4 }, async (err, address) => {
  if (err) {
    console.error('DNS Lookup Error:', err);
    return;
  }
  console.log('Resolved Address:', address);

  const client = new Client({
    user: 'postgres',
    host: address,
    database: 'postgres',
    password: 'Adworks2025?',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected successfully!');
    
    const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name;
    `);
    
    console.log('Tables found:');
    res.rows.forEach(row => console.log(`- ${row.table_schema}.${row.table_name}`));
    
    await client.end();
  } catch (connectErr) {
    console.error('Connection Error:', connectErr);
  }
});
