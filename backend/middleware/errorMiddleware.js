const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || err.statusCode || 500;
  
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
