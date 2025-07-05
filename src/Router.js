// src/Router.js - Phase 2: Middleware Pipeline with Global & Per-Route Middleware

const FindMyWay = require('find-my-way');

class OxyRouter {
  constructor() {
    this.router = FindMyWay({
      defaultRoute: (req, res) => {
        res.statusCode = 404;
        res.end('Not Found');
      },
      ignoreTrailingSlash: true,
      allowUnsafeRegex: false
    });
    this.routes = [];
    this.globalMiddleware = [];
    this.errorHandler = null;
  }

  // Global middleware registration
  use(...middlewares) {
    this.globalMiddleware.push(...middlewares);
  }

  // Register a global error handler
  setErrorHandler(fn) {
    this.errorHandler = fn;
  }

  // Internal handler wrapper
  #wrapHandlers(handlers) {
    return async (req, res, params) => {
      req.params = params || {};
      let stack = [...this.globalMiddleware, ...handlers];
      let i = 0;

      const next = async (err) => {
        if (err) return this.#handleError(res, err, req);
        const handler = stack[i++];
        if (!handler) return;

        try {
          await handler(req, res, next);
        } catch (error) {
          this.#handleError(res, error, req);
        }
      };

      await next();
    };
  }

  // Custom error handler fallback
  #handleError(res, error, req) {
    if (this.errorHandler) {
      return this.errorHandler(error, req, res);
    }
    res.statusCode = error.statusCode || 500;
    res.end(error.message || 'Internal Server Error');
  }

  // Register a route
  register(method, path, ...handlers) {
    this.routes.push({ method, path, handlers });
    this.router.on(method.toUpperCase(), path, this.#wrapHandlers(handlers));
  }

  // HTTP methods
  get(path, ...handlers) {
    this.register('GET', path, ...handlers);
  }
  post(path, ...handlers) {
    this.register('POST', path, ...handlers);
  }
  put(path, ...handlers) {
    this.register('PUT', path, ...handlers);
  }
  delete(path, ...handlers) {
    this.register('DELETE', path, ...handlers);
  }
  all(path, ...handlers) {
    this.register('ALL', path, ...handlers);
  }

  // HTTP server handler
  handler() {
    return (req, res) => {
      this.router.lookup(req, res);
    };
  }

  // Route listing
  getRoutes() {
    return this.routes;
  }
}

module.exports = OxyRouter;
