import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    requestId: req.requestId // Assuming you add request IDs via middleware
  });

  // Mongoose validation error handling
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors,
      errorCode: 'VALIDATION_ERROR'
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value',
      errorCode: 'DUPLICATE_ERROR'
    });
  }

  // Default error response
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    errorCode: err.errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};