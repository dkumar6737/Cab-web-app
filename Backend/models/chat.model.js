const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  senderType: {
    type: String,
    enum: ["user", "captain"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Chat", chatSchema);
