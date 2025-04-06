const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderImage: { type: String },
  text: { type: String, required: true },
  system: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
