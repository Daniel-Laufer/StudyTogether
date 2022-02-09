//code take from https://blog.logrocket.com/implementing-a-secure-password-reset-in-node-js/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});

const token = mongoose.model("token", tokenSchema);
module.exports = token;
