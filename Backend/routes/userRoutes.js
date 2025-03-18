// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

router.post("/update-profile", verifyToken, upload.single("profileImage"), userController.updateProfile);
router.get("/api/users", verifyToken, userController.fetchUsers);

module.exports = router;
