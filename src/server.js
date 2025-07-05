const http = require('http');
const os = require('os');
const cluster = require('cluster');
const { WebSocketServer } = require('ws');
const { OxyRouter } = require('./Router'); // Adjust path

const numCPUs = os.cpus().length;

function startServer({ port = 3000, setup, maxPayload = '1mb' }) {
  if (cluster.isPrimary) {
    console.log(`👑 Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.warn(`💀 Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });

    return;
  }

  const router = new OxyRouter();

  // Setup user-defined routes/middleware
  if (typeof setup === 'function') {
    setup(router);
  }

  const server = http.createServer(async (req, res) => {
    try {
      await router.handleRequest(req, res);
    } catch (err) {
      console.error(`❌ Request error:`, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // WebSocket server
  const wss = new WebSocketServer({ noServer: true, maxPayload });

  server.on('upgrade', (req, socket, head) => {
    try {
      router.handleUpgrade(req, socket, head, wss);
    } catch (err) {
      console.error(`❌ WebSocket upgrade error:`, err);
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
    }
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log(`🛑 Worker ${process.pid} shutting down...`);
    wss.clients.forEach((client) => client.terminate());
    server.close(() => {
      console.log(`✅ Server closed`);
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.listen(port, () => {
    console.log(`🚀 Worker ${process.pid} running at http://localhost:${port}`);
  });

  return server;
}

module.exports = { startServer };
