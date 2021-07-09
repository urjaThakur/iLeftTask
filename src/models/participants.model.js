const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const participantsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

participantsSchema.pre("save", async function (next) {
  const participants = this;
  if (participants.isModified("password")) {
    participants.password = await bcrypt.hash(participants.password, 8);
  }
  next();
});

participantsSchema.methods.generateAuthToken = async function () {
  const participants = this;
  const token = jwt.sign(
    { _id: participants._id.toString() },
    "justanothertoken"
  );

  participants.tokens = participants.tokens.concat({
    token: token,
  });
  await participants.save();
  return token;
};

participantsSchema.statics.findByCredentials = async (email, password) => {
  const participants = await Participants.findOne({ email: email });
  if (!participants) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, participants.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return participants;
};

const Participants = mongoose.model("Participants", participantsSchema);

module.exports = Participants;
