const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/*
 * TODO: make this in to a generic verifySchema, and specify the type of verfifcation request by
 * added a new field called type: {type: string, required: true, enum :['TA', 'email', 'unban', ....]}
 */

const reportSchema = new Schema({
  reporterId: { type: mongoose.Types.ObjectId, required: true },
  accusedId: { type: mongoose.Types.ObjectId, required: true },
  description: { type: String, required: true },
  reportType: { type: String, required: true, enum: ['User', 'Group'] },
});

const report = mongoose.model('report', reportSchema);

module.exports = report;
