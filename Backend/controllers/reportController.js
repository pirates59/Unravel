// controllers/reportController.js
const Comment = require("../models/Comment");
const User = require("../models/Signup"); // Updated to use Signup model

exports.getReportedComments = async (req, res) => {
  try {
    // Find comments where the reported flag is set
    const comments = await Comment.find({ reported: true }).sort({ createdAt: -1 });
    
    // For each reported comment, fetch user details based on the comment’s author (assumed to be unique)
    const reportedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ name: comment.author });
        return {
          _id: comment._id,
          commentContent: comment.text,
          createdAt: comment.createdAt,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                isFrozen: user.isFrozen, // Ensure isFrozen field exists in Signup if needed
              }
            : {
                name: comment.author,
                email: "Not available",
                profileImage: "default-avatar.png",
                isFrozen: false,
              },
        };
      })
    );
    res.json(reportedComments);
  } catch (error) {
    console.error("Error fetching reported comments:", error);
    res.status(500).json({ error: "Failed to fetch reported comments." });
  }
};
