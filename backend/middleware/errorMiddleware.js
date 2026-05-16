const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  
  // Supabase specific error handling
  if (err.code === '22P02') { 
    return res.status(400).json({ success: false, error: 'Invalid UUID format provided to database.' });
  }
  if (err.code === 'PGRST116') {
    return res.status(404).json({ success: false, error: 'Record not found.' });
  }
  if (err.code === '23503') {
    return res.status(404).json({ success: false, error: 'Referenced record (foreign key) not found.' });
  }
  
  const status = err.status || err.statusCode || 500;
  
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack || err })
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
