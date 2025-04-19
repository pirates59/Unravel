// models/Post.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for user-generated posts
const PostSchema = new Schema({
  author: {              // Display name at creation time 
    type: String,
    default: "Anonymous",
  },
  authorId: {            // Reference to the user who created the post
    type: Schema.Types.ObjectId,
    ref: "Signup",
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    default: "default-avatar.png",
  },
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [String], // Array of user IDs who liked the post
    default: [],
  },
});

module.exports = mongoose.model("Post", PostSchema);
