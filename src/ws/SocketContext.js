// src/ws/SocketContext.js

const roomManager = require('./rooms');

class SocketContext {
  constructor({ socket, request, route, path, query }) {
    this.socket = socket;
    this.req = request;
    this.path = path;
    this.query = query;
    this.params = {}; // To be set later from matchPath
    this.auth = null; // To be set by auth middleware
    this.route = route;
    this.room = null;

    socket.on('message', msg => {
      try {
        const data = JSON.parse(msg);
        if (this.route.onMessage) {
          this.route.onMessage(this, data);
        }
      } catch (err) {
        this.sendError(err);
      }
    });

    socket.on('close', () => {
      if (this.room) roomManager.leave(this.room, socket);
      if (this.route.onClose) {
        this.route.onClose(this);
      }
    });
  }

  send(data) {
    try {
      this.socket.send(JSON.stringify({ ok: true, data }));
    } catch (err) {
      this.sendError(err);
    }
  }

  sendError(error) {
    const payload = {
      ok: false,
      message: error.message || 'Unexpected socket error',
      status: error.status || 500
    };
    this.socket.send(JSON.stringify(payload));
  }

  join(roomName) {
    this.room = roomName;
    roomManager.join(roomName, this.socket);
  }

  broadcast(roomName, message) {
    roomManager.broadcast(roomName, message, this.socket);
  }
}

module.exports = SocketContext;
