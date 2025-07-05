# ⚡ oxy-route

> 🚀 A modern, high-performance routing framework for Node.js with Express-like syntax — built with trie-based routing, middleware, validation, WebSocket, logging, clustering, and Prometheus monitoring.

[![npm](https://img.shields.io/npm/v/oxy-route)](https://www.npmjs.com/package/oxy-route)
[![license](https://img.shields.io/github/license/kkennymore/oxy-route)](LICENSE)
[![tests](https://img.shields.io/github/actions/workflow/status/kkennymore/oxy-route/test.yml)](https://github.com/kkennymore/oxy-route/actions)

---

## 🔧 Installation

Install from npm or GitHub:

```bash
# From NPM (once published)
npm install oxy-route

# From GitHub
npm install git+ssh://git@github.com/kkennymore/oxy-route.git
```

---

## 🚀 Getting Started

```js
const http = require('http');
const { Router } = require('oxy-route');

const router = new Router();

router.get('/ping', (req, res) => {
  res.end('pong');
});

http.createServer(router.handler()).listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
```

---

## 📁 Features

✅ Trie-based routing engine for ultra-fast performance  
✅ Middleware stack with `async`, `next()`, and robust error handling  
✅ Request validation with [Zod](https://zod.dev) for both HTTP and WebSocket  
✅ WebSocket engine with room broadcasting, middleware, reconnect/auth support  
✅ Integrated security: `helmet`, sanitization, and rate-limiting  
✅ Logging (Winston) + `/metrics` endpoint (Prometheus-compatible)  
✅ Cluster support via Node.js cluster or PM2  
✅ Hot-reload dev server and command-line tools  
✅ Fully tested with Jest and benchmarked  

---

## 📦 Full Example

```js
const { z } = require('zod');
const {
  Router,
  WebSocketEngine,
  validate,
  Logger,
  ClusterEngine,
  security
} = require('oxy-route');

const router = new Router();

// Global middleware
router.use(security.helmet);
router.use(security.rateLimiter);
router.use(security.sanitizer);

// HTTP Route
router.post(
  '/login',
  validate({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
  }),
  (req, res) => {
    res.json({ token: 'fake-jwt-token' });
  }
);

// WebSocket-enhanced route
router.post(
  '/chat/send',
  async (req, res) => {
    res.json({ message: 'sent via WebSocket and HTTP' });
  },
  { isSocket: true }
);

// Cluster entry point
ClusterEngine(() => {
  const http = require('http');
  const server = http.createServer(router.handler());
  new WebSocketEngine(server, router.websocketRoutes);
  server.listen(5000, () => Logger.log('🚀 Server running on port 5000'));
});
```

---

## 🔌 WebSocket Support

`oxy-route` allows building real-time WebSocket APIs just like HTTP:

```js
const WebSocketEngine = require('oxy-route').WebSocketEngine;

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

You can also enable WebSocket fallback for any HTTP route using:

```js
router.post('/chat/message', handler, { isSocket: true });
```

---

## 🛡️ Security Built-in

- `helmet` for secure headers
- `rateLimiter` for IP-based throttling
- `sanitizer` to clean query/body input

These can be added globally or per route.

---

## 📊 Metrics & Logging

- `/metrics` endpoint for Prometheus scraping
- Request metrics by method/route/status
- Winston-powered structured logs
- Unique request IDs for traceability

---

## 🛠️ CLI Usage

`oxy-route` comes with a CLI to scaffold apps, run benchmarks, or test:

```bash
oxy-route create my-app        # Scaffold project from template
oxy-route dev routes/app.js    # Launch dev server with hot reload
oxy-route test                 # Run unit + integration tests
oxy-route bench                # Benchmark the router
oxy-route version              # Show current version
oxy-route help                 # List commands
```

---

## 🧪 Testing

Run all Jest-based unit and integration tests:

```bash
npm run test
```

---

## ⚡ Benchmarking

Evaluate the routing engine under stress:

```bash
npm run bench
```

---

## 🧰 Dev Tools

- `startDevServer(path)` to run hot-reload on route file
- `debug()` helper for internal inspection
- `mockRequest`, `mockRouter` testing tools

---

## 🌐 Folder Structure (Template)

```
my-app/
├── routes/
│   └── app.routes.js
├── ws/
│   └── chat.routes.js
├── controllers/
├── middlewares/
├── tests/
│   ├── unit/
│   └── integration/
├── app.js
└── .env
```

---

## 🤝 Contributing

We welcome your contributions! To get involved:

1. Fork the repo
2. Create a new feature branch
3. Write tests for your feature
4. Submit a PR with description

Run formatting and lint before pushing:

```bash
npm run lint
npm run test
```

---

## 📄 License

**MIT License** © 2025 [Usiobaifo Kenneth](mailto:kenneth@hitekfinancials.com)

---

## 📬 Contact

- **Maintainer:** [Usiobaifo Kenneth](mailto:kenneth@hitekfinancials.com)  
- **Twitter:** [@kkennymore](https://twitter.com/kkennymore)  
- **GitHub:** [github.com/kkennymore](https://github.com/kkennymore)

---

## ⭐ Star the Repo

If you find `oxy-route` useful, consider starring the repo to support the project!

```bash
https://github.com/kkennymore/oxy-route
```

---
