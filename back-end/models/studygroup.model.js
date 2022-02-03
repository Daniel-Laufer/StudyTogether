const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studygroupSchema = new Schema({
  title: { type: String, required: true },
  day: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  imageUrl: { type: String, required: true },
  availability: { type: String, required: true },
  hostName: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
}, { collection: 'studygroups' });

const studygroup = mongoose.model("studygroup", studygroupSchema);

module.exports = studygroup;
