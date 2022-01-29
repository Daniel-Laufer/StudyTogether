const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {type: String,required: true},
  lastName: {type: String,required: true},
  email: {type: String,required: true},
  role: {type: String,required: true},
  verified: {type: Boolean, required: true}
});

const user = mongoose.model('user', userSchema);

module.exports = user;