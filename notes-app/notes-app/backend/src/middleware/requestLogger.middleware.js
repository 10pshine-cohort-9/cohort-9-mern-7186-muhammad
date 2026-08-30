const pinoHttp = require('pino-http');
const logger = require('../config/logger');

/**
 * Logs every incoming HTTP request and its response (status, duration).
 * Uses the shared Pino logger so all logs share the same format/sinks.
 */
const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} completed - ${res.statusCode}`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} failed - ${err.message}`,
  redact: ['req.headers.authorization'],
});

module.exports = requestLogger;
