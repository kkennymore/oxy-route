// tests/unit/validator.test.js

const { validate } = require('../../src/validation/validator');
const http = require('http');
const supertest = require('supertest');
const { z } = require('zod');

describe('Validator Middleware - Unit Tests', () => {
  let app, server;

  beforeAll(() => {
    const middleware = validate({
      body: z.object({
        name: z.string().min(3),
        age: z.number().min(18)
      })
    });

    const handler = (req, res) => {
      res.end(`Welcome ${req.body.name}, age ${req.body.age}`);
    };

    app = http.createServer((req, res) => {
      if (req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', async () => {
          req.body = JSON.parse(data || '{}');
          await middleware(req, res, () => handler(req, res));
        });
      }
    });

    server = supertest(app);
  });

  test('Valid payload passes validation', async () => {
    const res = await server.post('/').send({ name: 'John', age: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Welcome John, age 30');
  });

  test('Invalid payload returns 400', async () => {
    const res = await server.post('/').send({ name: 'Al', age: 15 });
    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});
