// controllers/reportController.js
const Comment = require('../models/Comment');
const User = require('../models/Signup'); // Using Signup model for user details

// Fetch all comments that have been reported by users
exports.getReportedComments = async (req, res) => {
  try {
    // Retrieve reported comments, sorted by most recent first
    const comments = await Comment.find({ reported: true }).sort({ createdAt: -1 });

    // For each reported comment, attach author details or fallback data
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
                isFrozen: user.isFrozen || false,
              }
            : {
                name: comment.author,
                email: 'Not available',
                profileImage: 'default-avatar.png',
                isFrozen: false,
              },
        };
      })
    );

    // Return the enriched list of reported comments
    res.json(reportedComments);
  } catch (error) {
    console.error('Error fetching reported comments:', error);
    res.status(500).json({ error: 'Failed to fetch reported comments.' });
  }
};

// Unflag a specific comment, marking it as no longer reported
exports.releaseComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    // Update the comment's reported state and clear the reportedAt timestamp
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { reported: false, reportedAt: null },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Send back the updated comment document
    res.json(updatedComment);
  } catch (error) {
    console.error('Error releasing comment:', error);
    res.status(500).json({ error: 'Error releasing comment.' });
  }
};
