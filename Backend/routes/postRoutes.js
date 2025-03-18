// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

router.post("/api/posts", verifyToken, upload.single("image"), postController.createPost);
router.get("/api/posts", verifyToken, postController.getPosts);
router.get("/api/posts/:postId", verifyToken, postController.getPostById);
router.put("/api/posts/:postId", verifyToken, upload.single("image"), postController.updatePost);
router.delete("/api/posts/:postId", verifyToken, postController.deletePost);

router.get("/api/posts/:postId/comments", verifyToken, postController.getComments);
router.post("/api/posts/:postId/comments", verifyToken, postController.addComment);
router.put("/api/posts/:postId/comments/:commentId", verifyToken, postController.updateComment);
router.delete("/api/posts/:postId/comments/:commentId", verifyToken, postController.deleteComment);

router.post("/api/posts/:postId/like", verifyToken, postController.likePost);
router.post("/api/posts/:postId/comments/:commentId/report", verifyToken, postController.reportComment);

module.exports = router;