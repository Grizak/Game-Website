const mongoose = require("mongoose");

const clickerSchema = new mongoose.Schema({
  clicks: {
    type: Number,
    default: 0,
  },
  currency: {
    type: Number,
    default: 0,
  },
  upgrades: {
    type: Array,
    default: [],
  },
  cps: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  clickerGame: clickerSchema,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
