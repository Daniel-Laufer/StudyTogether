const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studygroupseriesSchema = new Schema({
  studyGroups: { type: [mongoose.Types.ObjectId], required: true },
  finalDateTime: { type: Date, required: true },
  recurring: { type: String, required: true },
});

const studygroupseries = mongoose.model(
  'studygroupseries',
  studygroupseriesSchema
);

module.exports = studygroupseries;
