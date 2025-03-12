const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {
    type: String,
    default: "Anonymous"
  },
  content: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: "default-avatar.png"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);
