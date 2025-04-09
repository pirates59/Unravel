// models/Notification.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: { type: String, required: true }, // You might also consider storing recipient as a persistent id
  actorId: { type: Schema.Types.ObjectId, ref: "Signup", required: true }, // persistent user id for the actor
  actor: { type: String, required: true },     // original username at notification creation
  actorName: { type: String },                 // actor's display name (will be overridden by populated value if available)
  actorProfileImage: { type: String },         // actor's profile image URL (ditto)
  type: { type: String, enum: ["like", "comment"], required: true },
  postId: { type: String, required: true },
  state: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
