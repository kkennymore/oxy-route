# oxy-route

> 🚀 A fast, secure, extensible routing framework for Node.js with Express-like syntax — powered by trie-based routing, middleware, validation, WebSocket, logging, and metrics.

![npm](https://img.shields.io/npm/v/oxy-route)
![license](https://img.shields.io/github/license/yourname/oxy-route)
![tests](https://img.shields.io/github/workflow/status/yourname/oxy-route/test)

---

## 🔧 Installation

```bash
npm install oxy-route
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

router.post('/register',
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
    handlers: [ctx => ctx.join('room1')],
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
oxy-route bench              # Run benchmark
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