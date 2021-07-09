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

// get all meeting details
router.get("/meeting/getAll", auth, async (req, res) => {
  try {
    const meeting = await Meeting.find({});
    res.send(meeting);
  } catch (e) {
    res.status(500).send(e);
  }
});

//update a meeting details
router.put("/meeting/:id", auth, async (req, res) => {
  let meeting = await Meeting.findById(req.params.id);
  let details = {
    Name: req.body.Name ? req.body.Name : meeting.Name,
    Description: req.body.Description
      ? req.body.Description
      : meeting.Description,
    Date: req.body.Date ? req.body.Date : meeting.Date,
    Venue: req.body.Venue ? req.body.Venue : meeting.Venue,
    Time: req.body.Time ? req.body.Time : meeting.Time,
  };
  Meeting.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: details,
    },
    { new: true },
    function (err, data) {
      if (err) {
        res.send({ code: 500, error: err });
      } else if (!data) {
        res.send({ code: 400, message: "Not Updated" });
      } else {
        res.send(data);
      }
    }
  );
});

//delete the meeting
router.delete("/meeting/:id", auth, async (req, res) => {
  Meeting.findOneAndDelete({ _id: req.params.id }, function (err, docs) {
    if (err) {
      res.send({ code: 400, message: err });
    } else {
      res.send(docs);
    }
  });
});

module.exports = router;
