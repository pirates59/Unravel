// models/Signup.js
const mongoose = require("mongoose");

// Schema for user signup and account management
const SignupSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true }, // hashed password
  otp:           { type: String },                 // One-time password for verification or reset
  otpExpires:    { type: Date },
  role:          { type: String, enum: ["admin", "user", "doctor"], default: "user" },
  profileImage:  { type: String, default: "upload.png" },
  isFirstLogin:  { type: Boolean, default: true }, // Forces password reset or onboarding
  isFrozen:      { type: Boolean, default: false }, // Account freeze status
});

module.exports = mongoose.model("Signup", SignupSchema);
