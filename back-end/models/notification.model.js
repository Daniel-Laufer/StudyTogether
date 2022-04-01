const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO: create a trigger that deletes all notififations a week old
const notificationSchema = new Schema(
  {
    subscribers: {
      type: [mongoose.Types.ObjectId],
      required: true,
      default: [],
    },
    type: {
      type: String,
      required: true,
      enum: ['attend', 'edit', 'host'],
    },
    summary: {
      type: String,
      required: true,
      default: '',
    },
    groupId: {
      type: mongoose.Types.ObjectId,
      required: true,
      default: null,
    },
    followedUserID: {
      type: mongoose.Types.ObjectId,
      required: true,
      default: null,
    },
    groupTitle: {
      type: String,
      required: true,
      default: '',
    },
    groupHost: {
      type: String,
      required: true,
      default: '',
    },
    groupDescription: {
      type: String,
      required: true,
      default: '',
    },
    preview: {
      type: String,
      required: true,
      default: '',
    },
  },
  { collection: 'notifications' }
);

const notification = mongoose.model('notification', notificationSchema);
module.exports = notification;
