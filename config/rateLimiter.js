const rateLimit = require('express-rate-limit');

/**
 * Task 7 Rate Limiting Middleware
 * Prevents API abuse by limiting request volume per IP window.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'HTTP 429: Too Many Requests. Rate limit exceeded. Please try again after 15 minutes.',
      retryAfterSeconds: 900
    });
  }
});

// Stricter limiter for Auth endpoints (Login / Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 minutes
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'HTTP 429: Too many authentication attempts from this IP. Please wait 15 minutes.'
    });
  }
});

module.exports = { apiLimiter, authLimiter };
