import { app } from './app.js';
import { ENV } from './config/env.js';
import { connectPrisma } from './config/prisma.js';
import { logger } from './utils/logger.js';

async function startServer() {
  await connectPrisma();

  const server = app.listen(ENV.PORT, () => {
    logger.info(`🚀 Server running in ${ENV.NODE_ENV} mode on http://localhost:${ENV.PORT}`);
    logger.info(`📚 Swagger OpenAPI documentation available at http://localhost:${ENV.PORT}/api/v1/docs`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
  });
}

startServer();
