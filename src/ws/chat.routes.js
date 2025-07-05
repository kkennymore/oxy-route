/**
 * @file ws/chat.routes.js
 * @module WS/Chat
 * @summary WebSocket chat room routes using oxy-route
 */

const { z } = require('zod');
const { validate } = require('oxy-route/src/validation/validator');

module.exports = router => {
  // Simple chat message broadcast route (fallback for WebSocket or HTTP)
  router.post('/chat/message', validate({
    body: z.object({
      room: z.string(),
      message: z.string().min(1),
      user: z.string()
    })
  }), (req, res, { io }) => {
    io.to(req.body.room).emit('chat:message', {
      user: req.body.user,
      message: req.body.message,
      time: Date.now()
    });
    res.json({ status: 'sent' });
  }, { isSocket: true });

  // Pure WebSocket room join handler
  router.socket('/chat/join', ({ socket, data }) => {
    const { room, user } = data;
    socket.join(room);
    socket.to(room).emit('chat:joined', { user });
  });

  // Pure WebSocket leave handler
  router.socket('/chat/leave', ({ socket, data }) => {
    const { room, user } = data;
    socket.leave(room);
    socket.to(room).emit('chat:left', { user });
  });
};
