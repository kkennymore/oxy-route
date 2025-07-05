// src/logging/logger.js

const { createLogger, format, transports } = require('winston');
const { v4: uuidv4 } = require('uuid');
const { combine, timestamp, json } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  defaultMeta: { service: 'oxy-route' },
  transports: [
    new transports.Console(),
  ]
});

function requestLogger(req, res, next) {
  const start = Date.now();
  req.id = uuidv4();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      id: req.id,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
}

module.exports = { logger, requestLogger };
