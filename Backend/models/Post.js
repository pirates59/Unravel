const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {              // Display name at creation time (for older posts)
    type: String,
    default: "Anonymous",
  },
  authorId: {            // NEW: persistent id of the user who created the post
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
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Post", PostSchema);
