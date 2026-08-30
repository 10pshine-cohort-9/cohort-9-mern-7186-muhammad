const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Catches requests that didn't match any route and forwards
 * a 404 ApiError into the global error handler below.
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Global error handler.
 *
 * Responsibilities:
 * 1. Normalize database and application errors.
 * 2. Log errors with appropriate severity using Pino.
 * 3. Return a consistent and safe JSON response to the client.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Translate common Sequelize errors into ApiErrors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors?.map((e) => e.message).join(', ') || 'Validation error';
    error = new ApiError(400, message, true);
  } else if (!(err instanceof ApiError)) {
    error = ApiError.internal(
      process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    );
  }

  const { statusCode, message, isOperational, details } = error;

  const logPayload = { err, statusCode, path: req.originalUrl, method: req.method };
  if (isOperational) {
    logger.warn(logPayload, `Handled error: ${message}`);
  } else {
    logger.error(logPayload, `Unexpected error: ${message}`);
  }

  res.status(statusCode || 500).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== 'production' && !isOperational ? { stack: err.stack } : {}),
  });
};

module.exports = { notFoundHandler, errorHandler };
