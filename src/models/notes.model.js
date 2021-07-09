const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  meetingId: { type: mongoose.Schema.ObjectId, ref: "Meeting" },
});

const Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;
