// routes/therapistRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const Therapist = require("../models/Therapist");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Or wherever you want to store images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// @route   GET /therapists
// @desc    Get all therapists
router.get("/therapists", async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (error) {
    console.error("Error fetching therapists:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST /therapists
// @desc    Create a new therapist
router.post("/therapists", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      daysAvailable,
      startTime,
      endTime,
    } = req.body;

    // If daysAvailable was sent as a comma-separated string, split it
    let parsedDays = daysAvailable;
    if (typeof daysAvailable === "string") {
      parsedDays = daysAvailable.split(",").map((d) => d.trim());
    }

    const newTherapist = new Therapist({
      name,
      email,
      specialization,
      daysAvailable: parsedDays,
      startTime,
      endTime,
      image: req.file ? "uploads/" + req.file.filename : null,
    });

    const savedTherapist = await newTherapist.save();
    res.json(savedTherapist);
  } catch (error) {
    console.error("Error creating therapist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   DELETE /therapists/:id
// @desc    Delete a therapist by ID
router.delete("/therapists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTherapist = await Therapist.findByIdAndDelete(id);
    if (!deletedTherapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    res.json({ message: "Therapist removed successfully" });
  } catch (error) {
    console.error("Error deleting therapist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
