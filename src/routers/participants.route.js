const express = require("express");
const Participants = require("../models/participants.model");
const auth = require("../middleware/auth");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const router = new express.Router();

// Create a participant
router.post("/participants/create", async (req, res) => {
  const participants = new Participants(req.body);
  try {
    await participants.save();
    const token = await participants.generateAuthToken();
    res.status(201).send({ participants, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login for a participant
router.post("/participants/login", async (req, res) => {
  try {
    const participants = await Participants.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await participants.generateAuthToken();
    res.send({ participants, token });
  } catch (e) {
    res.status(400).send();
  }
});

// Logout for a participant
router.post("/participants/logout", auth, async (req, res) => {
  try {
    req.participants.tokens = req.participants.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.participants.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// get All participant details accesible only if a customer is logged in
router.get("/participants/getAll", auth, async (req, res) => {
  try {
    const participants = await Participants.find({});
    res.send(participants);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get individual participant details
router.get("/participants/me", auth, async (req, res) => {
  try {
    res.send(req.participants);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
