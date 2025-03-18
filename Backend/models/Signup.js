/*****************************************************
 * models/Signup.js
 *****************************************************/
const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  otp: String,
  otpExpires: Date,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  profileImage: { type: String, default: "upload.png" },
  isFirstLogin: { type: Boolean, default: true },
});

const SignupModel = mongoose.model("Signup", SignupSchema);
module.exports = SignupModel;
