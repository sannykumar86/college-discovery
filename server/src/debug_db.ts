import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

async function debug() {
  console.log('Connecting to:', process.env.DATABASE_URL?.replace(/:[^:]+@/, ':***@'));
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const res = await pool.query('SELECT COUNT(*) FROM colleges');
    console.log('Colleges count:', res.rows[0].count);
    
    const users = await pool.query('SELECT COUNT(*) FROM users');
    console.log('Users count:', users.rows[0].count);
    
    const firstCollege = await pool.query('SELECT * FROM colleges LIMIT 1');
    console.log('First college sample:', firstCollege.rows[0]?.name);
    
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await pool.end();
  }
}

debug();
