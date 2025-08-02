import { logger } from '../utils/logger.js';
// Add request ID and log request details
export const requestLogger = (req, res, next) => {
  // Add unique request ID if not already present
  const requestId = req.get('x-request-id')
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  
  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Log request details
  logger.info(`Incoming request`, {
    method: req.method,
    url: req.originalUrl,
    ip,
    requestId,
    userAgent: req.get('user-agent'),
  });
  
  // Log response time when request completes
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](`Request completed`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      requestId,
    });
  });
  
  next();
};
