// tests/benchmark/route.bench.js

const http = require('http');
const autocannon = require('autocannon');
const Router = require('../../src/Router');

// Basic router setup
const router = new Router();
router.get('/ping', (req, res) => {
  res.end('pong');
});

const server = http.createServer(router.handler());
server.listen(0, () => {
  const port = server.address().port;
  console.log(`🚀 Benchmarking http://localhost:${port}/ping`);

  autocannon(
    {
      url: `http://localhost:${port}/ping`,
      connections: 100,
      duration: 10,
      pipelining: 1
    },
    (err, results) => {
      if (err) throw err;
      console.log(autocannon.printResult(results));
      server.close();
    }
  );
});
