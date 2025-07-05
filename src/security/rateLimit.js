// src/security/rateLimit.js

const rateStore = new Map();

function rateLimit({ windowMs = 60000, max = 100 } = {}) {
  return (req, res, next) => {
    const ip = req.socket.remoteAddress;
    const now = Date.now();

    if (!rateStore.has(ip)) {
      rateStore.set(ip, []);
    }

    const timestamps = rateStore.get(ip).filter(ts => now - ts < windowMs);
    timestamps.push(now);
    rateStore.set(ip, timestamps);

    if (timestamps.length > max) {
      res.statusCode = 429;
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.end('Too many requests. Please try again later.');
    }

    next();
  };
}

module.exports = rateLimit;
