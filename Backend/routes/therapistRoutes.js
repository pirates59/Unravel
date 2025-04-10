const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const transporter = require("../config/mailer");

const Therapist = require("../models/Therapist");
const SignupModel = require("../models/Signup");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // preserve original extension
  },
});
const upload = multer({ storage });

// GET /therapists — fetch all therapists
router.get("/therapists", async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    console.error("Error fetching therapists:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// routes/therapistRoutes.js
router.post("/therapists", upload.single("image"), async (req, res) => {
 

  try {
    const { name, email, specialization, daysAvailable, startTime, endTime } = req.body;

    // Check if a therapist with this email already exists
    const existingTherapist = await Therapist.findOne({ email });
    if (existingTherapist) {
      return res.status(400).json({ error: "A therapist with this email already exists." });
    }

    // Parse daysAvailable if sent as a JSON string
    let parsedDays = daysAvailable;
    if (typeof daysAvailable === "string") {
      parsedDays = JSON.parse(daysAvailable);
    }

    // Save the therapist record
    const newTherapist = new Therapist({
      name,
      email,
      specialization,
      daysAvailable: parsedDays,
      startTime,
      endTime,
      image: req.file ? `uploads/${req.file.filename}` : null,
    });
    const savedTherapist = await newTherapist.save();

    // Generate a one‑time default password (e.g., a 6‑digit number)
    const defaultPassword = crypto.randomInt(100000, 999999).toString();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Check if a doctor user already exists for this email
    const existingDoctor = await SignupModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ error: "A doctor with this email already exists." });
    }

    // Create the doctor user account with isFirstLogin set to true
    await SignupModel.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      isFirstLogin: true,
    });

    // Send email with the default password (non‑blocking)
    transporter
      .sendMail({
        from: '"Unravel" <no-reply@yourapp.com>',
        to: email,
        subject: "Your account is Ready",
        html: `
          <p>Hi ${name},</p>
          <p>Your profile has been set up as a <strong>verified doctor</strong> on our system.</p>
          <p>
            <strong>Login Email:</strong> ${email}<br/>
            <strong>One‑Time Password:</strong> ${defaultPassword}
          </p>
          <p>When you log in for the first time, you will be prompted to reset your password.</p>
          <p>Regards,<br/>The Unravel Team</p>
        `,
      })
      .then(info => {
        
      })
      .catch(mailErr => {
        
      });

    // Respond with the saved therapist record
    res.json(savedTherapist);

  } catch (err) {
   
    if (err.code === 11000) {
      return res.status(400).json({ error: "The provided email is already in use." });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /therapists/:id — delete a therapist by ID
router.delete("/therapists/:id", async (req, res) => {
  try {
    const deleted = await Therapist.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    res.json({ message: "Therapist deleted" });
  } catch (err) {
    console.error("Error deleting therapist:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
