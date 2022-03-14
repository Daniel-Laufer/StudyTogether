const config = {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
};

const loadEventHandlers = io => {
  onConnection(io);
};

/**
 * Event handlers
 */
const onConnection = io => {
  io.on('connection', socket => {
    console.log('a user connected');
    socket.emit('notification');
  });
};

module.exports = {
  handleSocketIntegration(server) {
    const { Server } = require('socket.io');
    const io = new Server(server, config);
    loadEventHandlers(io);
  },
  sendNotification() {},
};
