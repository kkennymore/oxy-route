// tests/integration/app.test.js

const http = require('http');
const supertest = require('supertest');
const { z } = require('zod');
const Router = require('../../src/Router');
const { validate } = require('../../src/validation/validator');
const helmet = require('../../src/security/helmet');
const sanitize = require('../../src/security/sanitize');
const rateLimit = require('../../src/security/rateLimit');
const {
  prometheusMiddleware,
  metricsHandler
} = require('../../src/monitoring/metrics');
const { requestLogger } = require('../../src/logging/logger');

describe('App Integration - oxy-route full stack', () => {
  let server, app;

  beforeAll(() => {
    const router = new Router();

    router.use(requestLogger);
    router.use(helmet);
    router.use(sanitize);
    router.use(rateLimit({ windowMs: 1000, max: 10 }));

    router.post(
      '/register',
      validate({
        body: z.object({
          username: z.string().min(3),
          password: z.string().min(6)
        })
      }),
      (req, res) => {
        res.end(`Welcome ${req.body.username}`);
      }
    );

    router.get('/metrics', prometheusMiddleware('/metrics'), metricsHandler);

    app = http.createServer(router.handler());
    server = supertest(app);
  });

  test('POST /register with valid payload returns welcome', async () => {
    const res = await server
      .post('/register')
      .send({ username: 'admin', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome');
  });

  test('POST /register with invalid payload returns 400', async () => {
    const res = await server
      .post('/register')
      .send({ username: 'a', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  test('GET /metrics returns Prometheus metrics', async () => {
    const res = await server.get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });
});
