const Sockets = require('../helpers/SocketStore');
const userORM = require('../models/user.model');
const notifORM = require('../models/notification.model');
const groupORM = require('../models/studygroup.model');
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
    // console.log(`user ${userID} connected`);
    // console.log(`socket id is ${socket.id}`);
    // console.log(Object.keys(socketStore.sockets).length);

    if (userID) {
      socketStore.sockets[userID] = socket.id;

      // Join user to all their rooms associated with their studygroups and following
      var errors = [];
      attendGroups(userID, socket, errors);
      followUsers(userID, socket, errors);
      if (errors.length > 0) console.log('Errors: ', errors);
    }
  });
  io.on('disconnect', () => {
    console.log('user disconnected');
  });
};

/**
 *
 * @param {string} userID
 * @param {array} errors
 * @description Join the rooms associated with each study group the user is registered to
 */
const attendGroups = async (userID, socket, errors) => {
  const usr = await userORM.findById(userID).catch(err => {
    errors.push(err);
    return;
  });
  const groupIDs = usr?.registeredStudygroups.map(s => s.toString());
  await socket.join(groupIDs);
};
/**
 *
 * @param {string} userID
 * @param {array} followedUserIDs
 * @description Join the rooms associated with each followed user
 */
const followUsers = async (userID, socket, errors) => {
  const usr = await userORM.findById(userID).catch(err => {
    errors.push(err);
    return;
  });
  const userIDs = usr?.profileFollowing.map(s => s.toString());
  await socket.join(userIDs);
  //console.log(socket.rooms);
};

const getPreviewGroupNotification = (groupTitle, action) => {
  const titlePreview = groupTitle.substring(0, 15);
  var message = '';
  switch (action) {
    case 'edit':
      message = `Study group ${titlePreview}... has new changes!`;
      break;
    case 'cancel':
      message = `Study group ${titlePreview}... has been cancelled!`;
      break;
    case 'reactivate':
      message = `Study group ${titlePreview}... has been reactivated!`;
      break;
    default:
      console.log(`Err: action does not exist`);
      return;
  }
  return message;
};
const getPreviewFollowedNotification = (followedUserName, action) => {
  var message = '';
  switch (action) {
    case 'attend':
      message = `${followedUserName} has joined a new study group!`;
      break;
    case 'host':
      message = `${followedUserName} is hosting a new study group!`;
      break;
    default:
      console.log(`Err: action does not exist`);
      return;
  }
  return message;
};
module.exports = {
  handleSocketIntegration(server) {
    const { Server, Socket } = require('socket.io');
    io = new Server(server, config);
    onConnection();
  },
  /* emit actions */
  emitGroupUpdated(groupID, groupTitle, action) {
    const message = getPreviewGroupNotification(groupTitle, action);
    io?.to(groupID).emit('group-change', message, groupID);
  },
  emitFollowedUpdates(followedUserID, followedUserName, action) {
    const message = getPreviewFollowedNotification(followedUserName, action);

    io?.to(followedUserID).emit(
      'followed-user-update',
      message,
      followedUserID
    );
  },
  emitInviteMessage(inviteeUserID, inviterUserName, studygroupId) {
    var message = `${inviterUserName} has invited you to join their study group!`;
    // TODO need to handle invite-user-update on frontend
    // const socketID = socketStore.sockets[inviteeUserID];
    const socketID = socketStore.sockets[inviteeUserID];
    // const socket = io?.sockets.sockets.get(socketID);

    // io?.emit('invite-user', message, inviteeUserID);
    io?.to(socketID).emit('invite-user', message, studygroupId);
  },
  async attendGroups(userID, groupIDs, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io?.sockets.sockets.get(socketID).join(groupIDs);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async leaveGroups(userID, groupIDs, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io?.sockets.sockets.get(socketID).leave(groupIDs);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async followUsers(userID, followedUserID, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io?.sockets.sockets.get(socketID).join(followedUserID);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async unfollowUsers(userID, followedUserID, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io?.sockets.sockets.get(socketID).leave(followedUserID);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async saveNotification(groupID, followedUserId, action, isGroup) {
    var summary = '';
    var title = '';
    var host = '';
    var description = '';

    /* begin - getting information about the study group and/or followed user */
    const group = await groupORM.findById(groupID).catch(err => {
      console.log('Err: ' + err);
      return;
    });
    const usr = await userORM.findById(followedUserId).catch(err => {
      console.log('Err: ' + err);
      return;
    });
    const hostUser = await userORM.findById(group.hostId).catch(err => {
      console.log('Err: ' + err);
      return;
    });
    /* end */

    const subscribers =
      (isGroup
        ? group.attendees?.map(attendee => attendee.id)
        : usr.profileFollowers) ?? [];

    if (subscribers.length === 0) return; // If there is no one to receive the notification at the time, don't create it.

    var preview = isGroup
      ? getPreviewGroupNotification(group.title, action)
      : getPreviewFollowedNotification(usr.firstName, action);

    switch (action) {
      case 'host':
        summary = `[${usr.firstName}] has hosted a new study group!`;
        break;
      case 'edit':
        summary = `[${group.title}] has new changes!`;
        break;
      case 'attend':
        summary = `[${usr.firstName}] is attending a new study group!`;
        break;
      default:
        break;
    }
    title = group.title;
    host = hostUser.firstName;
    description = group.description;

    var newNotification = new notifORM({
      subscribers: subscribers,
      summary: summary,
      type: action,
      groupId: groupID,
      followedUserID: followedUserId,
      groupTitle: title,
      groupHost: host,
      groupDescription: description,
      preview: preview,
    });
    await newNotification.save().catch(err => console.log('Err: ' + err));
  },
};
