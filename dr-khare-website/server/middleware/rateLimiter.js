const rateLimit = require('express-rate-limit');

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per hour
  message: { error: 'Too many requests from this IP, please try again after an hour' }
});

module.exports = { strictLimiter };
