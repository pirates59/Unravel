const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.get("/api/users", verifyToken, userController.fetchUsers);
router.post("/update-profile", verifyToken, upload.single("profileImage"), userController.updateProfile);
router.delete("/api/users/:id", verifyToken, userController.deleteUser);
router.put("/api/users/freeze/:id", verifyToken, userController.freezeUser);

module.exports = router;
