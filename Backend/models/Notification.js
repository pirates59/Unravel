// models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true }, // storing username (or user id as string)
  actor: { type: String, required: true },     // storing username (or user id as string)
  actorName: { type: String },                 // optional: actor's display name
  actorProfileImage: { type: String },         // optional: actor's profile image URL
  type: { type: String, enum: ["like", "comment"], required: true },
  postId: { type: String, required: true },      // storing post id as string
  state: { type: Boolean, default: false },      // false = unread
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
