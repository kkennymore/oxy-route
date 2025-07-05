// src/ws/rooms.js

const rooms = new Map();

function join(room, socket) {
  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room).add(socket);

  socket.on('close', () => {
    leave(room, socket);
  });
}

function leave(room, socket) {
  if (!rooms.has(room)) return;
  rooms.get(room).delete(socket);
  if (rooms.get(room).size === 0) {
    rooms.delete(room);
  }
}

function broadcast(room, message, sender = null) {
  if (!rooms.has(room)) return;
  const payload = JSON.stringify({ ok: true, broadcast: true, data: message });
  for (const client of rooms.get(room)) {
    if (client !== sender && client.readyState === 1) {
      client.send(payload);
    }
  }
}

module.exports = { join, leave, broadcast };
