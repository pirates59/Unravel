const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Will store the file path to the uploaded image
    default: "",
  },
  count: {
    type: Number,
    default: 0, // For now, keep it static or 0
  },
});

module.exports = mongoose.model("Room", RoomSchema);
