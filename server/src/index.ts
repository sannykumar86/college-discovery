import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getDb, initializeDatabase } from './db/index.js';
import collegesRouter from './routes/colleges.js';
import authRouter from './routes/auth.js';
import savedRouter from './routes/saved.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/colleges', collegesRouter);
app.use('/api/auth', authRouter);
app.use('/api/saved', savedRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function start() {
  const db = await getDb();
  await initializeDatabase(db);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);

export default app;
