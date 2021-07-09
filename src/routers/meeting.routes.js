const express = require("express");
const Meeting = require("../models/meeting.model");
const auth = require("../middleware/auth");
const ObjectId = require("mongoose").Types.ObjectId;
const router = new express.Router();

// Create a meeting
router.post("/meeting/create", auth, async (req, res) => {
  const meeting = new Meeting(req.body);
  try {
    await meeting.save();
    res.status(201).send({ meeting });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
