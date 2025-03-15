// models/Post.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {
    type: String,
    default: "Anonymous",
  },
  content: {
    type: String,
    required: false, // allow posts that are image-only
  },
  profileImage: {
    type: String,
    default: "default-avatar.png",
  },
  // Field to store the uploaded image filename (if any)
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Post", PostSchema);
