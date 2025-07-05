function jsonParser() {
  return async (req, res, next) => {
    if (req.headers['content-type']?.includes('application/json')) {
      let body = '';
      req.on('data', (chunk) => body += chunk);
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
          next();
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      next();
    }
  };
}

module.exports = { jsonParser };
