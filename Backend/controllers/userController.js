// controllers/userController.js
const SignupModel = require("../models/Signup");

// Update profile image
exports.updateProfile = async (req, res) => {
  const email = req.user.email;
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }
  try {
    const updatedUser = await SignupModel.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { profileImage: req.file.filename, isFirstLogin: false },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({ success: true, message: "Profile image updated.", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ success: false, message: "Error updating profile image." });
  }
};

// Fetch users (only email, password, profileImage)
exports.fetchUsers = async (req, res) => {
  try {
    const users = await SignupModel.find({}, "email password profileImage");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
