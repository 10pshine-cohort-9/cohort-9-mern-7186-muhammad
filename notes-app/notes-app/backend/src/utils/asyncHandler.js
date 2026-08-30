/**
 * Wraps an async Express route handler so any rejected promise
 * (thrown error) is automatically forwarded to next(), which
 * routes it into the global error-handling middleware instead
 * of crashing the process or requiring a try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
