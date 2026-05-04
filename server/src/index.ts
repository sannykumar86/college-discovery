import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getDb, initializeDatabase, checkConnection } from './db/index.js';
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

app.get("/",(req,res) => {
  res.send("Backend is running");
});

// Health check
app.get('/api/health', async (_req, res) => {
  const dbStatus = await checkConnection();
  res.json({ 
    status: 'ok', 
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Initialize database and start server
async function start() {
  try {
    const db = await getDb();
    // Try to initialize, but don't crash the whole process if it fails
    initializeDatabase(db).catch(err => {
      console.error('Initial Database Setup Failed (will retry on demand):', err);
    });
  } catch (err) {
    console.error('Failed to get database pool:', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);

export default app;
