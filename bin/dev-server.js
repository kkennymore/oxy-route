// bin/dev-server.js

const path = require('path');
const { Router } = require('../src/Router');
const WebSocketEngine = require('../src/ws/Engine');
const http = require('http');

function startDevServer(routeFile = './routes/app.routes.js', port = 5000) {
  const router = new Router();
  const userRoutes = require(path.resolve(routeFile));
  userRoutes(router);

  const server = http.createServer(router.handler());
  new WebSocketEngine(server, router.websocketRoutes);

  server.listen(port, () => {
    console.log(`🧪 Oxy dev server running at http://localhost:${port}`);
  });

  return server;
}

module.exports = { startDevServer };
