const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.resolve(__dirname, 'apps/server/.env') });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

console.log('--- Database Connection Diagnostic ---');
console.log(`URL: ${url ? 'Set' : 'Missing'}`);
console.log(`Key: ${key ? 'Set' : 'Missing'}`);

if (!url || !key) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
  console.log('Testing connection...');
  const start = Date.now();
  
  // Try to fetch 1 row from users table (just to test connection)
  // Note: 'users' table might be empty or RLS restricted, but a network error will throw.
  const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

  const duration = Date.now() - start;

  if (error) {
    console.error(`❌ Connection Failed (${duration}ms):`);
    console.error(error.message);
    if (error.code) console.error(`Code: ${error.code}`);
    process.exit(1);
  } else {
    console.log(`✅ Connection Successful (${duration}ms)`);
    console.log('Database is reachable from this server.');
    process.exit(0);
  }
}

testConnection();
