var io = null;
const config = {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
};

/* Event handlers */
const onConnection = () => {
  io.on('connection', socket => {
    console.log('a user connected');
    //TODO: save the socket and the associated user (e.g redis).
  });
};

/* emit actions */

module.exports = {
  handleSocketIntegration(server) {
    const { Server } = require('socket.io');
    io = new Server(server, config);
    onConnection();
  },
  attendGroup(userID, groupID) {
    //1. Find the socket associated with the userID
    const socket = null;
    socket.join(groupID);
  },
  followUser(userID, followedUserID) {
    //1. Find the socket associated with the userID
    const socket = null;
    socket.join(followedUserID);
  },
  emitGroupUpdated(groupID, groupTitle) {
    const titlePreview = groupTitle.substring(0, 10);
    var message = '';
    switch (action) {
      case 'edit':
        message = `Study group ${titlePreview} has new changes!`;
        break;
      case 'cancel':
        message = `Study group ${titlePreview} has been cancelled!`;
        break;
      case 'reactivate':
        message = `Study group ${titlePreview} has been reactivated!`;
        break;
      default:
        console.log(`Err: action does not exist`);
        return;
    }
    io.to(groupID).emit('group-change', message);
  },
  emitFollowedUpdates(followedUserID, followedUserName, action) {
    var message = '';
    switch (action) {
      case 'register-group':
        message = `${followedUserName} has joined a new study group!`;
        break;
      case 'host-group':
        message = `${followedUserName} is hosting a new study-group!`;
        break;
      default:
        console.log(`Err: action does not exist`);
        return;
    }
    io.to(followedUserID).emit('followed-user-update', message);
  },
};
