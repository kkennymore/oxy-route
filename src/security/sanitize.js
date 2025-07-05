// src/security/sanitize.js

function sanitize(input) {
  if (typeof input === 'string') {
    return input
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/['"`]/g, '')
      .replace(/[;\\]/g, '')
      .replace(/--/g, '')
      .trim();
  } else if (typeof input === 'object' && input !== null) {
    for (const key in input) {
      input[key] = sanitize(input[key]);
    }
  }
  return input;
}

function sanitizeMiddleware(req, res, next) {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
}

module.exports = sanitizeMiddleware;
