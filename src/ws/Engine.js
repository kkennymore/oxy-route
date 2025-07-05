// src/ws/Engine.js

const WebSocket = require('ws');
const url = require('url');
const { parse } = require('querystring');
const { matchPath } = require('../utils/matchPath');
const SocketContext = require('./SocketContext');

class WebSocketEngine {
  constructor(server, wsRoutes = []) {
    this.server = server;
    this.routes = wsRoutes;
    this.wss = new WebSocket.Server({ noServer: true });

    server.on('upgrade', (req, socket, head) => {
      const { pathname, query } = url.parse(req.url);
      const route = this.routes.find(r =>
        (r.method === 'WS' || r.method === 'ALL') && matchPath(r.path, pathname)
      );

      if (!route) {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
        return;
      }

      this.wss.handleUpgrade(req, socket, head, ws => {
        this.#handleConnection(ws, req, route, pathname, parse(query));
      });
    });
  }

  #handleConnection(ws, req, route, path, query) {
    const ctx = new SocketContext({
      socket: ws,
      request: req,
      route,
      path,
      query
    });

    let i = 0;
    const next = async (err) => {
      if (err) return ctx.sendError(err);
      const fn = route.handlers[i++];
      if (!fn) return;

      try {
        await fn(ctx, next);
      } catch (error) {
        ctx.sendError(error);
      }
    };

    next();
  }
}

module.exports = WebSocketEngine;
