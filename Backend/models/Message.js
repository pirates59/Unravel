// models/Message.js
const mongoose = require("mongoose");

// Schema for messages exchanged in a chat room
const MessageSchema = new mongoose.Schema({
  room:         { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  senderId:     { type: String, required: true },
  senderName:   { type: String, required: true },
  senderEmail:  { type: String, required: true },
  senderImage:  { type: String }, // optional sender profile image
  text:         { type: String, required: true },
  system:       { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

// Export the Message model
module.exports = mongoose.model("Message", MessageSchema);
