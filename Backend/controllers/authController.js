// controllers/authController.js
const SignupModel = require("../models/Signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/mailer");
const JWT_SECRET = require("../config/jwt");

// Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userCount = await SignupModel.countDocuments();
    const role = userCount === 0 ? "admin" : "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await SignupModel.create({ name, email, password: hashedPassword, role });
    res.json({
      message: "User registered successfully",
      user: { name: newUser.name, role: newUser.role },
    });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Error registering user." });
  }
};

// Example snippet from controllers/authController.js (loginUser)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.json({ success: false, message: "This email is not registered." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Incorrect password. Please try again." });
    }
    const token = jwt.sign(
      { id: user._id, username: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        _id: user._id,         // NEW: send user id
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isFirstLogin: user.isFirstLogin,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
};

// Check email existence
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    res.json({ exists: !!user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not registered." });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.json({ success: true, message: "OTP verified." });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Failed to verify OTP." });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to reset password." });
  }
};
