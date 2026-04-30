import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

async function test(port: number) {
  console.log(`Testing port ${port} with explicit config...`);
  const pool = new Pool({
    user: 'postgres',
    host: 'db.yostplxmyffvqdkokskj.supabase.co',
    database: 'postgres',
    password: 'Sanny@qwerty12345@#$',
    port: port,
    connectionTimeoutMillis: 10000,
  });
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    console.log(`Success on port ${port} in ${Date.now() - start}ms`);
    return true;
  } catch (err: any) {
    console.log(`Failed on port ${port}: ${err.message}`);
    return false;
  } finally {
    await pool.end();
  }
}

async function start() {
  await test(5432);
  await test(6543);
}

start();
