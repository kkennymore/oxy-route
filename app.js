
const { startServer } = require('./index'); // adjust path if necessary
const { jsonParser } = require('./src/middleware/middleware'); // Optional, your own JSON parser
const { OxyRouter } = require('./src/Router');

startServer({
  port: process.env.PORT || 3000,
  setup: (router) => {
    // Optional JSON body parser middleware
    router.use(jsonParser());
    
    // Sample HTTP route
    router.post('/register', async (req, res) => {
      return res.status(201).json({ message: 'User registered' });
    });

    // WebSocket endpoint
    router.ws('/chat', async (socket) => {
      socket.send('Connected to chat');
      socket.on('message', (msg) => {
        socket.send(`Echo: ${msg}`);
      });
    });
  }
});

module.exports = startServer;
