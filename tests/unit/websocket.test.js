// tests/unit/websocket.test.js

const http = require('http');
const WebSocket = require('ws');
const WebSocketEngine = require('../../src/ws/Engine');

describe('WebSocket Engine - Integration Test', () => {
  let server;
  let port;

  const route = {
    method: 'WS',
    path: '/chat',
    handlers: [
      (ctx, next) => {
        ctx.auth = { user: 'testUser' };
        ctx.join('room1');
        ctx.send({ welcome: true });
        next();
      }
    ],
    onMessage: (ctx, data) => {
      ctx.broadcast('room1', { msg: data.msg });
    }
  };

  beforeAll(done => {
    server = http.createServer();
    new WebSocketEngine(server, [route]);
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll(done => {
    server.close(done);
  });

  test(
    'broadcasts messages between WebSocket clients in same room',
    done => {
      const ws1 = new WebSocket(`ws://localhost:${port}/chat`);
      const ws2 = new WebSocket(`ws://localhost:${port}/chat`);

      const messages1 = [];
      const messages2 = [];

      let closed = 0;
      const tryClose = () => {
        closed++;
        if (closed === 2) {
          done();
        }
      };

      ws1.on('message', msg => messages1.push(JSON.parse(msg)));
      ws2.on('message', msg => {
        const parsed = JSON.parse(msg);
        messages2.push(parsed);

        if (parsed.broadcast) {
          expect(parsed.ok).toBe(true);
          expect(parsed.data.msg).toBe('Hello from ws1');
          ws1.close();
          ws2.close();
        }
      });

      ws1.on('close', tryClose);
      ws2.on('close', tryClose);

      ws2.on('open', () => {
        setTimeout(() => {
          ws1.send(JSON.stringify({ msg: 'Hello from ws1' }));
        }, 300);
      });
    },
    10000 // Extended timeout for async WS
  );
});
