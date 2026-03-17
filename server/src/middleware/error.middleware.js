function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const statusCode =
    err.code === "LIMIT_FILE_SIZE" ? 400 : err.statusCode || 500;
  const message =
    err.code === "LIMIT_FILE_SIZE"
      ? "PDF file is too large. Maximum size is 5 MB."
      : err.message || "Internal server error.";

  res.status(statusCode).json({
    ok: false,
    message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
