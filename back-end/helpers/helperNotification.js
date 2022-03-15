const Sockets = require('../helpers/SocketStore');
const userORM = require('../models/user.model');
var socketStore = Sockets.getInstance();

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
    var userID = socket.handshake.headers.userid;
    console.log(`user ${userID} connected`);
    if (userID && !(userID in socketStore.sockets)) {
      socketStore.sockets[userID] = socket;

      //TODO: join users to all their groups
      var errors = [];
      attendGroups(userID, errors);
    }
  });
};

/**
 *
 * @param {string} userID
 * @param {array} errors
 * @description Join the rooms associated with each study group the user is registered to
 */
const attendGroups = async (userID, errors) => {
  const usr = await userORM.findById(userID).catch(err => {
    errors.push(err);
    return;
  });

  const groupIDs = usr.registeredStudygroups.map(s => s.toString());
  console.log(groupIDs);
  if (userID in socketStore.sockets) {
    const socket = socketStore.sockets[userID];
    await socket.join(groupIDs);
    console.log(socket.rooms);
  } else {
    errors.push('User was not found!');
  }
};
/**
 *
 * @param {string} userID
 * @param {array} followedUserIDs
 * @description Join the rooms associated with each followed user
 */
const followUsers = (userID, followedUserIDs) => {
  if (userID in socketStore.sockets) {
    const socket = socketStore.sockets[userID];
    socket.join(followedUserIDs);
  } else {
    errors.push('User was not found!');
  }
};

module.exports = {
  handleSocketIntegration(server) {
    const { Server, Socket } = require('socket.io');
    io = new Server(server, config);
    onConnection();
  },

  /* emit actions */
  emitGroupUpdated(groupID, groupTitle, action) {
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
    console.log(`Checking ${groupID} with the message ${message}`);
    io.emit('group-change', message);
    // io.to(groupID).emit('group-change', message);
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
