const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/*
 * TODO: make this in to a generic verifySchema, and specify the type of verfifcation request by
 * added a new field called type: {type: string, required: true, enum :['TA', 'email', 'unban', ....]}
 */

const taverifySchema = new Schema({
  userid: { type: mongoose.Types.ObjectId, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
});

const taverify = mongoose.model('taverify', taverifySchema);

module.exports = taverify;
