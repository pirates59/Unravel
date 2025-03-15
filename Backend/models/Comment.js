const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  author: {
    // This will store the username (or user ID) of the commenter
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Add profileImage to store the commenter's profile picture
  profileImage: {
    type: String,
    default: "default-avatar.png",
  },
  reported: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Comment", CommentSchema);
