# oxy-route

> 🚀 A fast, secure, extensible routing framework for Node.js with Express-like syntax — powered by trie-based routing, middleware, validation, WebSocket, logging, and metrics.

![npm](https://img.shields.io/npm/v/oxy-route)
![license](https://img.shields.io/github/license/yourname/oxy-route)
![tests](https://img.shields.io/github/workflow/status/yourname/oxy-route/test)

---

## 🔧 Installation

```bash
npm install oxy-route
npm install github:kkennymore/oxy-route

```

---

## 🚀 Getting Started

```js
const http = require('http');
const Router = require('oxy-route');

const router = new Router();

router.get('/ping', (req, res) => {
  res.end('pong');
});

http.createServer(router.handler()).listen(3000);

const {
  Router,
  WebSocketEngine,
  validate,
  security,
  Logger,
  ClusterEngine
} = require('oxy-route');

const router = new Router();

// Basic route
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Socket route
router.post(
  '/chat/send',
  async (req, res) => {
    res.json({ message: 'sent' });
  },
  { isSocket: true }
);

// Validation
router.post(
  '/login',
  validate({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
  }),
  (req, res) => {
    res.json({ token: 'JWT_TOKEN' });
  }
);

// Cluster Mode
ClusterEngine(() => {
  const http = require('http');
  const server = http.createServer(router.handler());
  new WebSocketEngine(server, router.websocketRoutes);
  server.listen(5000, () => Logger.log('Server running on 5000'));
});
```

---

## 📁 Features

✅ Trie-based routing engine  
✅ Middleware stack with `async`, `next()`, error propagation  
✅ `Zod` validation for HTTP & WebSocket  
✅ WebSocket engine with rooms, middleware, broadcast support  
✅ `helmet`, `sanitize`, rate limiting security  
✅ Prometheus `/metrics` + Winston structured logging  
✅ Cluster-ready + hot-reload dev tooling (CLI WIP)  
✅ Fully tested + benchmarked

---

## 📚 Example

```js
const { z } = require('zod');
const { validate } = require('oxy-route/src/validation/validator');
const { requestLogger } = require('oxy-route/src/logging/logger');

const router = new Router();

router.use(requestLogger);

router.post(
  '/register',
  validate({
    body: z.object({
      username: z.string().min(3),
      password: z.string().min(6)
    })
  }),
  (req, res) => {
    res.end(`Hello ${req.body.username}`);
  }
);
```

---

## 🔌 WebSocket Support

```js
const WebSocketEngine = require('oxy-route/src/ws/Engine');

const wsRoutes = [
  {
    method: 'WS',
    path: '/chat',
    handlers: [(ctx) => ctx.join('room1')],
    onMessage: (ctx, data) => ctx.broadcast('room1', { text: data.text })
  }
];

new WebSocketEngine(httpServer, wsRoutes);
```

---

## 🛠️ CLI Usage

```bash
oxy-route create my-app      # Scaffold project
oxy-route test               # Run tests
oxy-route create my-api      # Scaffold new project
oxy-route dev routes/app.js  # Run dev server
oxy-route bench              # Benchmark router
oxy-route version            # Show version
oxy-route help               # Show usage
```

---

## 🧪 Testing

```bash
npm run test     # runs unit + integration tests
```

## ⚡ Benchmarking

```bash
npm run bench
```

---

## 🤝 Contributing

Pull requests welcome! To contribute:

1. Fork the repo
2. Create a feature branch
3. Add tests for your changes
4. Submit a PR

---

## 📄 License

MIT © 2025 Usiobaifo Kenneth

---

## 📬 Contact

Maintainer: [Usiobaifo Kenneth](mailto:kenneth@hitekfinancials.com)  
Twitter: [@yourhandle](https://twitter.com/yourhandle)  
GitHub: [github.com/kkennymore](https://github.com/kkennymore)
