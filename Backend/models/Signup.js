const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String, // For OTP storage
  otpExpires: Date, // For OTP expiration time
});

const SignupModel = mongoose.model("signup", SignupSchema);
module.exports = SignupModel;
