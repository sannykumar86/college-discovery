import { Pool } from 'pg';

const pool = new Pool(
  process.env.DATABASE_URL ? { 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: {
      rejectUnauthorized: false
    }
  } : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    connectionTimeoutMillis: 10000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  }
);

export async function getDb(): Promise<Pool> {
  return pool;
}

export async function checkConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    console.error('Database Connection Check Failed:', err);
    return false;
  }
}

export async function initializeDatabase(db: Pool): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS colleges (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      state TEXT NOT NULL,
      fees INTEGER NOT NULL,
      rating REAL NOT NULL,
      courses TEXT NOT NULL DEFAULT '[]',
      placement_percentage REAL DEFAULT 0,
      established_year INTEGER,
      type TEXT NOT NULL DEFAULT 'Private',
      description TEXT,
      image_url TEXT,
      website TEXT,
      avg_package REAL DEFAULT 0,
      highest_package REAL DEFAULT 0,
      total_students INTEGER DEFAULT 0,
      accepted_exams TEXT NOT NULL DEFAULT '[]',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS saved_colleges (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      college_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
      UNIQUE(user_id, college_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      college_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
    )
  `);
}

// Wrapper for SQLite's '?' bindings to Postgres '$1, $2, ...' bindings
export async function queryAll(db: Pool, sql: string, params: any[] = []): Promise<any[]> {
  try {
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    const result = await db.query(pgSql, params);
    return result.rows || [];
  } catch (error) {
    console.error('Database Query Error:', { sql, params, error });
    throw error;
  }
}

export async function queryOne(db: Pool, sql: string, params: any[] = []): Promise<any | null> {
  const results = await queryAll(db, sql, params);
  return results && results.length > 0 ? results[0] : null;
}

export async function run(db: Pool, sql: string, params: any[] = []): Promise<void> {
  try {
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    await db.query(pgSql, params);
  } catch (error) {
    console.error('Database Run Error:', { sql, params, error });
    throw error;
  }
}
