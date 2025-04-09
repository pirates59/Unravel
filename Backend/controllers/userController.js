// controllers/userController.js
const SignupModel = require("../models/Signup");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const bcrypt = require("bcrypt");

exports.fetchUsers = async (req, res) => {
  try {
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

// Update profile: username, email, and optionally profile image
exports.updateProfile = async (req, res) => {
  const emailFromToken = req.user.email; // provided by verifyToken middleware
  let updateData = {};

  if (req.body.username) {
    updateData.name = req.body.username;
  }
  if (req.body.email) {
    updateData.email = req.body.email;
  }
  if (req.file) {
    updateData.profileImage = req.file.filename;
  }
  updateData.isFirstLogin = false;

  try {
    const updatedUser = await SignupModel.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${emailFromToken}$`, "i") } },
      updateData,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    // Propagate changes to all posts, comments, and notifications created by this user
    await Post.updateMany(
      { authorId: updatedUser._id },
      { author: updatedUser.name, profileImage: updatedUser.profileImage }
    );
    await Comment.updateMany(
      { authorId: updatedUser._id },
      { author: updatedUser.name, profileImage: updatedUser.profileImage }
    );
    await Notification.updateMany(
      { actorId: updatedUser._id },
      { actorName: updatedUser.name, actorProfileImage: updatedUser.profileImage }
    );
    res.json({ success: true, message: "Profile updated successfully.", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Error updating profile." });
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

exports.changePassword = async (req, res) => {
  const emailFromToken = req.user.email;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Both current and new passwords are required.",
    });
  }

  try {
    const user = await SignupModel.findOne({
      email: { $regex: new RegExp(`^${emailFromToken}$`, "i") },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({
      success: false,
      message: "Error updating password.",
    });
  }
};
