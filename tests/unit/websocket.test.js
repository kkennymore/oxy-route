// tests/unit/websocket.test.js

const http = require('http');
const WebSocket = require('ws');
const WebSocketEngine = require('../../src/ws/Engine');

const server = http.createServer();

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

new WebSocketEngine(server, [route]);

server.listen(0, () => {
  const port = server.address().port;
  const ws1 = new WebSocket(`ws://localhost:${port}/chat`);
  const ws2 = new WebSocket(`ws://localhost:${port}/chat`);

  let messages1 = [];
  let messages2 = [];

  ws1.on('message', (msg) => messages1.push(JSON.parse(msg)));
  ws2.on('message', (msg) => {
    messages2.push(JSON.parse(msg));
    if (messages2.length === 2) {
      console.log('Test passed:', messages2);
      ws1.close();
      ws2.close();
      server.close();
    }
  });

  ws2.on('open', () => {
    setTimeout(() => {
      ws1.send(JSON.stringify({ msg: 'Hello from ws1' }));
    }, 300);
  });
});
