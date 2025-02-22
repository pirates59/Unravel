const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const SignupModel = require("./models/Signup");
const ServiceSelectionModel = require("./models/ServiceSelection");
const Booking = require("./models/Booking");
const InformationSchema = require("./models/Information");
const Post = require("./models/Post"); 

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lenishaghimire07@gmail.com", // Replace with your Gmail address
    pass: "aycz dckk hich mciz",         // Replace with your 16-character app password
  },
});

mongoose.connect("mongodb://127.0.0.1:27017/fyp");

// Helper to normalize date to UTC
const normalizeToUTC = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)); // Month is zero-indexed
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ success: false, message: "Invalid email format." });
  }
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.json({ success: false, message: "This email is not registered." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Incorrect password. Please try again." });
    }
    return res.json({ success: true, message: "Login successful." });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
});

app.post("/service-selection", async (req, res) => {
  const { service, therapist, finalize } = req.body;
  if (!service || !therapist) {
    return res.status(400).json({ success: false, message: "Service and therapist are required." });
  }
  try {
    if (finalize) {
      const newSelection = await ServiceSelectionModel.create({ service, therapist });
      return res.status(201).json({ success: true, data: newSelection });
    }
    return res.status(200).json({ success: true, message: "Selection temporarily stored." });
  } catch (err) {
    console.error("Error saving service selection:", err.message);
    res.status(500).json({ success: false, message: "An error occurred while saving the data." });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await SignupModel.create({ name, email, password: hashedPassword });
    res.json({ message: "User registered successfully" }); 
  } catch (err) {
    console.error("Error during registration:", err.message); 
    res.status(500).json("Error registering user.");
  }
});

app.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (user) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
});

app.get("/booked-dates", async (req, res) => {
  const { month, year } = req.query;
  try {
    const bookings = await Booking.find({ month, year });
    const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
    const bookedDates = {};

    bookings.forEach((booking) => {
      const dateKey = `${booking.year}-${booking.month}-${booking.day}`;
      if (!bookedDates[dateKey]) bookedDates[dateKey] = { times: [], isFullyBooked: false };
      bookedDates[dateKey].times.push(booking.time);
      if (bookedDates[dateKey].times.length === timeSlots.length)
        bookedDates[dateKey].isFullyBooked = true;
    });

    res.json(bookedDates); 
  } catch (err) {
    console.error("Error fetching booked dates:", err.message);
    res.status(500).json({ success: false, message: "An error occurred while fetching bookings." });
  }
});

app.post("/book", async (req, res) => {
  const { date, time, firstName, lastName, contact, email, service, therapist } = req.body;
  if (!date || !time || !firstName || !lastName || !contact || !email || !service || !therapist) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }
  try {
    const normalizedDate = normalizeToUTC(date);
    const year = normalizedDate.getUTCFullYear();
    const month = normalizedDate.getUTCMonth() + 1; // Convert back to 1-based
    const day = normalizedDate.getUTCDate();

    const existing = await Booking.findOne({ year, month, day, time });
    if (existing) {
      return res.status(400).json({ message: "Timeslot already booked." });
    }

    const booking = new Booking({
      year,
      month,
      day,
      time,
      firstName,
      lastName,
      contact,
      email,
      service,
      therapist,
    });
    await booking.save();

    res.status(201).json({ message: "Booking successful!" });
  } catch (err) {
    console.error("Error booking:", err);
    res.status(500).json({ error: err.message || "Failed to book timeslot." });
  }
});

app.post("/information", async (req, res) => {
  const { firstName, lastName, contact, email } = req.body;
  const errors = [];
  if (!firstName) errors.push("First name is required.");
  if (!lastName) errors.push("Last name is required.");
  if (!contact || !/^\d{10}$/.test(contact)) errors.push("Valid 10-digit contact number is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required.");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }
  try {
    const newInformation = new InformationSchema({
      firstName,
      lastName,
      contact,
      email,
    });
    await newInformation.save();
    res.status(201).json({
      success: true,
      data: newInformation,
    });
  } catch (err) {
    console.error("Error saving information:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the information.",
    });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not registered." });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    await user.save();

    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.json({ success: true, message: "OTP verified." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to verify OTP." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to reset password." });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  const { author, content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const post = new Post({ author: author || "Anonymous", content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all posts (newest first)
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDIT POST endpoint: update a post's content based on its ID
app.put("/api/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.content = content;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Post endpoint: Delete a post by its ID
app.delete("/api/posts/:postId", async (req, res) => {
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
});


app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
