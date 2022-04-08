const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studygroupSchema = new Schema(
  {
    //general info
    title: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    phone: { type: String, required: true },
    imageUrl: { type: String, required: true },
    curAttendees: { type: Number, min: 0, default: 0, required: true },
    location: { type: { lng: Number, lat: Number }, required: true },
    maxAttendees: { type: Number, min: 2, required: true },
    hostId: { type: mongoose.Types.ObjectId, required: true },
    hostName: { type: String, required: true },
    description: { type: String, required: true },
    attendees: {
      type: [
        {
          id: mongoose.Types.ObjectId,
          name: String,
          imgSrc: String,
          _id: false,
        },
      ],
      default: [],
      required: true,
    },
    tags: { type: [String], required: true },
    official: { type: Boolean, required: true, default: false },

    // Recurring
    recurring: {
      type: String,
      enum: ['N/A', 'weekly', 'bi-weekly'],
      default: 'N/A',
      required: true,
    },
    recurringFinalDateTime: {
      type: Date,
      required: function () {
        return this.recurring !== 'N/A';
      },
    },

    //Status
    canceledAt: { type: Date, default: undefined, required: false }, //TLL index for deleting a group after canceling. Not meant to be parsed in the frontend.
    canceled: { type: Boolean, default: false, required: false },
    rescheduled: { type: Boolean, default: false, required: false },

    //Accessabililty.
    private: { type: Boolean, default: false, required: true },
    paid: { type: Boolean, default: false, required: false },
    invitees: {
      type: [mongoose.Types.ObjectId],
      default: [],
      required: function () {
        return this.private;
      },
    },

    //Series
    seriesId: { type: mongoose.Types.ObjectId, required: true },
  },
  { collection: 'studygroups' }
);
//indexes
studygroupSchema.index({ canceledAt: 1 }, { expireAfterSeconds: 0 });

const studygroup = mongoose.model('studygroup', studygroupSchema);

module.exports = studygroup;
