// src/monitoring/metrics.js

const client = require('prom-client');
const Registry = client.Registry;
const register = new Registry();

// Metrics
const httpRequestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

register.registerMetric(httpRequestCount);
register.registerMetric(httpRequestDuration);

function prometheusMiddleware(routePath = 'unknown') {
  return (req, res, next) => {
    const end = httpRequestDuration.startTimer({
      method: req.method,
      route: routePath
    });

    res.on('finish', () => {
      httpRequestCount.inc({
        method: req.method,
        route: routePath,
        status: res.statusCode
      });
      end();
    });

    next();
  };
}

function metricsHandler(req, res) {
  res.setHeader('Content-Type', register.contentType);
  register.metrics().then((metrics) => res.end(metrics));
}

module.exports = { prometheusMiddleware, metricsHandler };
