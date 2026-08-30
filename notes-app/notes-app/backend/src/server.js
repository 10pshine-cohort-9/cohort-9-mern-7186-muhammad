require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { sequelize, connectDB } = require('./config/database');
require('./models'); // registers User/Note models + associations

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // In development, keep the schema in sync automatically.
  // In production, prefer real migrations instead of alter-sync.
  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized.');
  }

  const server = app.listen(PORT, () => {
    logger.info(`Notes App backend listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      sequelize.close().then(() => process.exit(0));
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error({ err: reason }, 'Unhandled Promise Rejection');
  });
  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'Uncaught Exception');
    process.exit(1);
  });
};

startServer();
