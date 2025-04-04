// controllers/postController.js
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { author, content, profileImage } = req.body;
    const imageFilename = req.file ? req.file.filename : null;
    if (!content && !imageFilename) {
      return res.status(400).json({ error: "Content or image is required" });
    }
    const newPost = new Post({
      author: author || "Anonymous",
      content: content || "",
      profileImage: profileImage || "default-avatar.png",
      image: imageFilename,
    });
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all posts with comment count
exports.getPosts = async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });
    posts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post.toObject(), commentCount };
      })
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single post by id
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (req.body.content !== undefined) {
      post.content = req.body.content;
    }
    if (req.file) {
      if (post.image) {
        const oldImagePath = path.join(uploadDir, post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = req.file.filename;
    }
    if (req.body.removeImage === "true") {
      if (post.image) {
        const oldImagePath = path.join(uploadDir, post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = null;
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { text, currentUser } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.author !== currentUser) {
      return res.status(403).json({ error: "You can only edit your own comments." });
    }
    comment.text = text;
    comment.updatedAt = new Date();
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment." });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { currentUser } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.author !== currentUser) {
      return res.status(403).json({ error: "You can only delete your own comments." });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  let { currentUser, author: actorName, profileImage: actorProfileImage } = req.body;
  if (!currentUser) {
    return res.status(400).json({ error: "currentUser is required." });
  }
  actorName = actorName || currentUser;
  actorProfileImage = actorProfileImage || "default-avatar.png";
  
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const index = post.likes.indexOf(currentUser);
    if (index === -1) {
      post.likes.push(currentUser);
      if (post.author !== currentUser) {
        const newNotification = new Notification({
          recipient: post.author,
          actor: currentUser,
          actorName: actorName,
          actorProfileImage: actorProfileImage,
          type: "like",
          postId: post._id.toString(),
        });
        await newNotification.save();

        if (global.io) {
          global.io.to(post.author).emit("notification", newNotification);
        }
      }
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ count: post.likes.length, liked: post.likes.includes(currentUser) });
  } catch (error) {
    console.error("Error in likePost:", error);
    res.status(500).json({ error: "Failed to update like." });
  }
};

// Get a single post by id
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { text, author, profileImage, currentUser } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }
  try {
    const newComment = new Comment({
      postId,
      author: author || "Anonymous",
      text,
      profileImage: profileImage || "default-avatar.png",
    });
    await newComment.save();

    const post = await Post.findById(postId);
    if (post && post.author !== currentUser) {
      const newNotification = new Notification({
        recipient: post.author,
        actor: currentUser,
        actorName: author,
        actorProfileImage: profileImage,
        type: "comment",
        postId: post._id.toString(),
      });
      await newNotification.save();

      if (global.io) {
        global.io.to(post.author).emit("notification", newNotification);
      }
    }
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
};

// Report a comment
exports.reportComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { currentUser } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.author === currentUser) {
      return res.status(400).json({ error: "You cannot report your own comment." });
    }
    comment.reported = true;
    await comment.save();
    res.json({ message: "Comment reported successfully." });
  } catch (error) {
    console.error("Error reporting comment:", error);
    res.status(500).json({ error: "Failed to report comment." });
  }
};

