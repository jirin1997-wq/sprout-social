import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../public')));

// Database
let pool;

try {
  const poolConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, max: 20 }
    : {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'sprout_social',
        max: 20,
      };

  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    console.error('Database pool error:', err);
  });

  console.log('Database pool initialized');
} catch (err) {
  console.error('Failed to initialize database pool:', err.message);
  process.exit(1);
}

export { pool };

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/posts', (await import('./routes/posts.js')).default);
app.use('/api/accounts', (await import('./routes/accounts.js')).default);
app.use('/api/analytics', (await import('./routes/analytics.js')).default);
app.use('/api/messages', (await import('./routes/messages.js')).default);

// Serve frontend for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Sprout Social API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database configured: ${!!process.env.DATABASE_URL || 'Using local config'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    pool.end();
  });
});
