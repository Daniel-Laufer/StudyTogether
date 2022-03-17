const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const { notification_types } = require('../helpers/helperSocketio');
//TODO: create a trigger that deletes all notififations a week old
const notificationSchema = new Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    //if true, the notification message would say "user A has joined a new group! Click here to view more. "
    //otherwise, the notification is about the userID
    isFollowedUser: {
      type: Boolean,
      required: true,
      default: false,
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
  },
  { collection: 'notifications' }
);

const token = mongoose.model('notification', notificationSchema);
module.exports = token;
