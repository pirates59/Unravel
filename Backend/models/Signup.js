// models/Signup.js
const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  otp: String,
  otpExpires: Date,
  role: { type: String, enum: ["admin", "user", "doctor"], default: "user" },
  profileImage: { type: String, default: "upload.png" },
  isFirstLogin: { type: Boolean, default: true },
  isFrozen: { type: Boolean, default: false },
});

module.exports = mongoose.model("Signup", SignupSchema);
