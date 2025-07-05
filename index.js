// index.js

const Router = require('./src/Router');
const WebSocketEngine = require('./src/ws/Engine');
const ClusterEngine = require('./src/cluster/Engine');
const { validate } = require('./src/validation/validator');
const Logger = require('./src/logger');
const metrics = require('./src/monitoring/metrics');

// Security modules
const helmet = require('./src/security/helmet');
const rateLimiter = require('./src/security/rateLimiter');
const sanitizer = require('./src/security/sanitizer');

// CLI / Dev tools
const { startDevServer } = require('./bin/dev-server');
const debug = require('./src/tools/debugger');

// Testing helpers
const mockRouter = require('./src/testing/mockRouter');
const mockRequest = require('./src/testing/mockRequest');

module.exports = {
  Router,
  WebSocketEngine,
  ClusterEngine,
  validate,
  Logger,
  metrics,
  security: {
    helmet,
    rateLimiter,
    sanitizer
  },
  dev: {
    startDevServer,
    debug
  },
  test: {
    mockRouter,
    mockRequest
  }
};
