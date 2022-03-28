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
      default: 'REGISTERED',
      enum: ['FOLLOW', 'REGISTERED'],
    },
    summary: {
      type: String,
      required: true,
      default: '',
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
