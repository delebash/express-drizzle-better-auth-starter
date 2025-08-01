import { logger } from './logger.ts';
import pkg from 'express';
const { Request, Response, NextFunction } = pkg;

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: any[];
}

// Custom error class for API errors
export class ApiError extends Error implements AppError {
  statusCode: number;
  code: string;
  errors?: any[];

  constructor(statusCode: number, message: string, code = 'ERROR', errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', errors?: any[]): ApiError {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Not Found', code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, message, code);
  }

  static internal(message = 'Internal Server Error', code = 'INTERNAL_ERROR'): ApiError {
    return new ApiError(500, message, code);
  }
}

// Global error handler middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Something went wrong';
  
  // Log error details
  if (statusCode >= 500) {
    logger.error(`Error: ${message}`, {
      error: err.stack,
      path: req.path,
      method: req.method,
      requestId: req.get('x-request-id'),
    });
  } else {
    logger.warn(`Error: ${message}`, {
      errorCode,
      statusCode,
      path: req.path,
      method: req.method,
      requestId: req.get('x-request-id'),
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      errors: err.errors,
    },
  });
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};
