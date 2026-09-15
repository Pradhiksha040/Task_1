/**
 * Task 8 Server Request Logging Middleware
 * Captures Method, URL, Status Code, Response Duration (ms), and Timestamp.
 */

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();

  // Listen to finish event when response completes
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusCode = res.statusCode;

    // Colorized console output
    const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';

    console.log(
      `[${timestamp}] ${method} ${url} ${statusColor}${statusCode}${resetColor} - ${timeInMs} ms`
    );
  });

  next();
};

module.exports = requestLogger;
