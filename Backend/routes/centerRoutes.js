const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Center = require("../models/Center");

// Configure Multer storage for center images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create a new center
router.post("/centers", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path;
    }
    const newCenter = new Center({ name, image: imagePath });
    await newCenter.save();
    res.json(newCenter);
  } catch (error) {
    console.error("Error creating center:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all centers
router.get("/centers", async (req, res) => {
  try {
    const centers = await Center.find();
    res.json(centers);
  } catch (error) {
    console.error("Error fetching centers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a center by ID (admin functionality)
router.delete("/centers/:id", async (req, res) => {
  try {
    const centerId = req.params.id;
    const deletedCenter = await Center.findByIdAndDelete(centerId);
    if (!deletedCenter) {
      return res.status(404).json({ error: "Center not found" });
    }
    res.json({
      message: "Center deleted successfully",
      center: deletedCenter,
    });
  } catch (error) {
    console.error("Error deleting center:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
