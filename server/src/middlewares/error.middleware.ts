import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`[${req.method}] ${req.url} - Error:`, err.message || err);

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const errors = err instanceof ApiError ? err.errors : [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
