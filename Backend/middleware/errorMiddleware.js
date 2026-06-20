exports.errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // ── Server-side logging (always) ──────────────────────────────────
  console.error(`[ERROR] ${err.statusCode} - ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // ── Map known error types to proper status codes ──────────────────
  if (err.name === "ValidationError") err.statusCode = 400;
  if (err.name === "CastError") err.statusCode = 400;
  if (err.code === 11000) err.statusCode = 409; // MongoDB duplicate key
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") err.statusCode = 401;

  // ── Determine client-safe message ─────────────────────────────────
  let message = "Internal Server Error";
  if (process.env.NODE_ENV === "development") {
    message = err.message;
  } else if (err.statusCode < 500) {
    message = err.message; // Safe to expose 4xx details
  }

  res.status(err.statusCode).json({
    success: false,
    message,
  });
};
