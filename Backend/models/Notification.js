// models/Notification.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for notifications related to likes and comments
const NotificationSchema = new Schema({
  recipient:           { type: String, required: true }, // User who receives the notification
  actorId:             { type: Schema.Types.ObjectId, ref: "Signup", required: true }, // User who triggered the notification
  actor:               { type: String, required: true },
  actorName:           { type: String },
  actorProfileImage:   { type: String },
  type:                { type: String, enum: ["like", "comment"], required: true }, // Notification type
  postId:              { type: String, required: true },
  state:               { type: Boolean, default: false }, // Read/unread state
  createdAt:           { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
