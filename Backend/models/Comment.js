//models/Comment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for comments on posts
const CommentSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // Reference to the user who created the comment
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Signup",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Optional profile image for the author
  profileImage: {
    type: String,
    default: "default-avatar.png",
  },
  reported: {
    type: Boolean,
    default: false,
  },
  reportedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Comment", CommentSchema);
