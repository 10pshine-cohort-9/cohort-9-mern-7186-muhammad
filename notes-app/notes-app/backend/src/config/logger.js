const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

/**
 * Central Pino logger instance.
 * - Pretty-prints in development for readability.
 * - Emits structured JSON in production (ready for log aggregators).
 * - Stays quiet during automated tests unless LOG_LEVEL is explicitly set.
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (isTest ? 'silent' : 'info'),
  transport: !isProduction && !isTest
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: { service: 'notes-app-backend' },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
