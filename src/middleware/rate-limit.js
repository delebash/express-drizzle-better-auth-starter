import rateLimit from "express-rate-limit";

/**
 * Standard rate limiter for general API endpoints
 * Limits requests to 100 per 15 minutes per IP address
 */
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

/**
 * Strict rate limiter for sensitive endpoints like authentication
 * Limits requests to 10 per 15 minutes per IP address
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts from this IP, please try again after 15 minutes",
});

/**
 * Custom rate limiter factory function
 * Creates a rate limiter with custom configuration
 */
export const createRateLimiter = (
  windowMs = 15 * 60 * 1000,
  max= 100,
  message = "Too many requests from this IP, please try again"
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
  });
};
