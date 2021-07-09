const jwt = require("jsonwebtoken");
const Participants = require("../models/participants.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "justanothertoken");
    const participants = await Participants.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!participants) {
      throw new Error();
    }
    req.token = token;
    req.participants = participants;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
