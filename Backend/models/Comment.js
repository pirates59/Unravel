const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  // New authorId field to identify the comment owner
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Signup",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
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
