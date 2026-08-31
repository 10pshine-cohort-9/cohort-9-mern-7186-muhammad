/**
 * Custom error class for predictable, "operational" errors
 * (bad input, unauthorized, not found, etc.) as opposed to
 * unexpected programming/bugs. The global error middleware
 * uses `isOperational` to decide how much detail is safe to
 * expose to the client.
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null) {
    return new ApiError(400, message, true, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, true);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, true);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, true);
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message, true);
  }

  static internal(message = 'Something went wrong') {
    return new ApiError(500, message, false);
  }
}

module.exports = ApiError;
