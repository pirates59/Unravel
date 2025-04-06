// controllers/userController.js
const SignupModel = require("../models/Signup");

exports.fetchUsers = async (req, res) => {
  try {
    // Fetch users with role "user" and only include necessary fields.
    const users = await SignupModel.find(
      { role: "user" },
      "name email profileImage isFrozen"
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

exports.updateProfile = async (req, res) => {
  const email = req.user.email; // provided by verifyToken middleware
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

exports.freezeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await SignupModel.findByIdAndUpdate(
      userId,
      { isFrozen: true },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User frozen successfully.", user: updatedUser });
  } catch (err) {
    console.error("Error freezing user:", err);
    res.status(500).json({ message: "Error freezing user." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await SignupModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user." });
  }
};
