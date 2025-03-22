const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  sender: {
    type: String, // "USER" or "BOT" in this demo
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
