// tests/unit/router.test.js

const http = require('http');
const supertest = require('supertest');
const OxyRouter = require('../../src/Router');

describe('OxyRouter - Unit Tests', () => {
  let app, server;

  beforeAll(() => {
    const router = new OxyRouter();

    // Basic GET route
    router.get('/hello', (req, res) => {
      res.end('Hello World');
    });

    // Middleware chaining
    router.get('/chain', 
      (req, res, next) => { req.message = 'Hello'; next(); },
      (req, res) => res.end(req.message + ' Middleware')
    );

    // Error propagation
    router.get('/error', (req, res) => {
      throw new Error('Fail');
    });

    // Custom error handler
    router.setErrorHandler((err, req, res) => {
      res.statusCode = 500;
      res.end('Caught: ' + err.message);
    });

    app = http.createServer(router.handler());
    server = supertest(app);
  });

  test('GET /hello returns Hello World', async () => {
    const res = await server.get('/hello');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World');
  });

  test('Middleware chaining modifies request', async () => {
    const res = await server.get('/chain');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello Middleware');
  });

  test('Error is caught by global error handler', async () => {
    const res = await server.get('/error');
    expect(res.statusCode).toBe(500);
    expect(res.text).toContain('Caught: Fail');
  });
});
