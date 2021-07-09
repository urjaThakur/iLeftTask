const express = require("express");
const Notes = require("../models/notes.model");
const auth = require("../middleware/auth");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const router = new express.Router();

// create meeting
router.post("/meetingNotes/create", auth, async (req, res) => {
  const { meetingId } = req.body;
  if (!meetingId) throw error("require meeting id");
  const note = new Notes(req.body);
  try {
    await note.save();
    res.status(201).send({ note });
  } catch (e) {
    res.status(400).send(e);
  }
});

// get all note details
router.get("/meetingNotes/all", auth, async (req, res) => {
  try {
    const notes = await Notes.find({});
    res.status(200).send(notes);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get all notes by meeting id
router.get("/notes/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!id) throw new Error("id is required");
  try {
    const notes = await Notes.find({ meetingId: id });
    res.status(200).send(notes);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put("/notes/update/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Id required to update");

    let notes = await Notes.findById(id);
    let details = {
      Title: req.body.Title ? req.body.Title : notes.Title,
      Description: req.body.Description
        ? req.body.Description
        : notes.Description,
      meetingId: req.body.meetingId ? req.body.meetingId : notes.meetingId,
    };
    Notes.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: details,
      },
      { new: true },
      function (err, data) {
        if (err) {
          res.status(500).send({ code: 500, error: err });
        } else if (!data) {
          res
            .status(400)
            .send({ code: 400, message: "Not Updated, Note not found" });
        } else {
          res.status(200).send({
            code: 200,
            message: "Note Updated Successfully",
            User_updated: data,
          });
        }
      }
    );
  } catch (e) {
    res.status(500).send(e);
  }
});

// delete notes by id
router.delete("/notes/:id", auth, async (req, res) => {
  Notes.findOneAndDelete({ _id: req.params.id }, function (err, docs) {
    if (err) {
      res.send({ code: 400, message: err });
    } else {
      res
        .status(200)
        .send({ message: "Note deleted Successfully", Note_Deleted: docs });
    }
  });
});

module.exports = router;
