const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
    trim: true,
  },
  Date: {
    type: String,
    default: Date.now(),
  },
  Time: {
    type: String,
    default: Date.now(),
  },
  Venue: {
    type: String,
    required: true,
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
