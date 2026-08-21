import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { ENV } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS setup
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount SolveFlow AI API routes on both /api and /api/v1
app.use('/api', routes);
app.use('/api/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SolveFlow AI - Smart Daily Work & Problem Management System API',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use(errorHandler);
