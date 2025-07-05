const { ZodError } = require('zod');

/**
 * HTTP Validator Middleware
 */
function validate({ body, query, params }) {
  return async (req, res, next) => {
    try {
      if (body) {
        const parsed = body.safeParse(req.body || {});
        if (!parsed.success) {
          return sendValidationError(res, parsed.error, 'body');
        }
        req.body = parsed.data;
      }

      if (query) {
        const parsed = query.safeParse(req.query || {});
        if (!parsed.success) {
          return sendValidationError(res, parsed.error, 'query');
        }
        req.query = parsed.data;
      }

      if (params) {
        const parsed = params.safeParse(req.params || {});
        if (!parsed.success) {
          return sendValidationError(res, parsed.error, 'params');
        }
        req.params = parsed.data;
      }

      await next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * WebSocket Validator Middleware
 */
function wsValidate({ message }) {
  return async (ctx, next) => {
    try {
      if (message && ctx.route.onMessage) {
        const original = ctx.route.onMessage;

        ctx.route.onMessage = (ctx, data) => {
          const parsed = message.safeParse(data);
          if (!parsed.success) {
            return ctx.sendError({
              ok: false,
              errors: formatZodErrors(parsed.error.errors)
            });
          }

          return original(ctx, parsed.data);
        };
      }

      await next();
    } catch (err) {
      ctx.sendError({
        ok: false,
        error: err.message
      });
    }
  };
}

/**
 * Send validation error over HTTP
 */
function sendValidationError(res, error, source = 'body') {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      ok: false,
      errors: {
        [source]: formatZodErrors(error.errors)
      }
    })
  );
}

/**
 * Format Zod error details
 */
function formatZodErrors(errors) {
  return errors.map(e => ({
    path: e.path.join('.'),
    message: e.message
  }));
}

module.exports = { validate, wsValidate };
