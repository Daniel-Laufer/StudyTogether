const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taverifySchema = new Schema({
  userid: { type: mongoose.Types.ObjectId, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
});

const taverify = mongoose.model('taverify', taverifySchema);

module.exports = taverify;
