// src/validation/validator.js

const { ZodError } = require('zod');

function validate({ body, query, params }) {
  return async (req, res, next) => {
    try {
      if (body)   req.body   = body.parse(req.body || {});
      if (query)  req.query  = query.parse(req.query || {});
      if (params) req.params = params.parse(req.params || {});
      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ ok: false, errors: err.flatten() }));
      }
      next(err);
    }
  };
}

function wsValidate({ message }) {
  return async (ctx, next) => {
    try {
      if (message && ctx.route.onMessage) {
        const original = ctx.route.onMessage;
        ctx.route.onMessage = (ctx, data) => {
          try {
            const parsed = message.parse(data);
            return original(ctx, parsed);
          } catch (err) {
            return ctx.sendError(err);
          }
        };
      }
      await next();
    } catch (err) {
      ctx.sendError(err);
    }
  };
}

module.exports = { validate, wsValidate };
