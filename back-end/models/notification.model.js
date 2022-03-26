const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const { notification_types } = require('../helpers/helperSocketio');
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
      default: false,
      enum: ['FOLLOW', 'REGISTERED'],
    },
    message: {
      type: String,
      required: true,
      default: '',
    },
  },
  { collection: 'notifications' }
);

const token = mongoose.model('notification', notificationSchema);
module.exports = token;
