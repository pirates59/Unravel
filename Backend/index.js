const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const SignupModel = require("./models/Signup");
const ServiceSelectionModel = require("./models/ServiceSelection");
const Booking = require("./models/Booking");
const InformationSchema = require("./models/Information");
const Comment = require("./models/Comment");
const Post = require("./models/Post");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/fyp");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lenishaghimire07@gmail.com", // Replace with your Gmail address
    pass: "aycz dckk hich mciz",         // Replace with your 16-character app password
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const uploadMiddleware = multer({ storage: storage });

// --- JWT Setup ---
const JWT_SECRET = "your_jwt_secret_key"; // Change this to a secure value

// Middleware to verify token from the Authorization header
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
}

// --- Helper function ---
function normalizeToUTC(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// -----------------------
// Registration (public)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userCount = await SignupModel.countDocuments();
    const role = userCount === 0 ? "admin" : "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await SignupModel.create({ name, email, password: hashedPassword, role });
    res.json({ message: "User registered successfully", user: { name: newUser.name, role: newUser.role } });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Error registering user." });
  }
});

// -----------------------
// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // (Email format validation omitted for brevity)
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.json({ success: false, message: "This email is not registered." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Incorrect password. Please try again." });
    }
    // Sign token including email
    const token = jwt.sign(
      { id: user._id, username: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: { 
        name: user.name, 
        email: user.email,
        role: user.role, 
        profileImage: user.profileImage, 
        isFirstLogin: user.isFirstLogin 
      }
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
});

// /update-profile endpoint (protected)
app.post("/update-profile", verifyToken, uploadMiddleware.single("profileImage"), async (req, res) => {
  const email = req.user.email;  // Use email from token payload
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }
  try {
    const updatedUser = await SignupModel.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { profileImage: req.file.filename, isFirstLogin: false },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({ success: true, message: "Profile image updated.", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ success: false, message: "Error updating profile image." });
  }
});

// -----------------------
// SERVICE SELECTION (public; no token required)
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

// -----------------------
// Check Email (public)
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

// -----------------------
// BOOKED DATES (public; no token required)
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

// -----------------------
// BOOK (public; no token required)
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
    const month = normalizedDate.getUTCMonth() + 1;
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

// -----------------------
// INFORMATION (still protected with token)
app.post("/information", verifyToken, async (req, res) => {
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
    res.status(201).json({ success: true, data: newInformation });
  } catch (err) {
    console.error("Error saving information:", err.message);
    res.status(500).json({ success: false, message: "An error occurred while saving the information." });
  }
});

// -----------------------
// Forgot Password (public)
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not registered." });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
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

// -----------------------
// Verify OTP (public)
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }
  
  try {
    const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }
    
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    
    res.json({ success: true, message: "OTP verified." });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Failed to verify OTP." });
  }
});

// -----------------------
// Reset Password (public)
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

// -----------------------
// APPOINTMENTS (protected)
app.get("/appointments", verifyToken, async (req, res) => {
  try {
    const appointments = await Booking.find();
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

app.post("/api/posts", verifyToken, uploadMiddleware.single("image"), async (req, res) => {
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
});

// Get all posts (protected)
app.get("/api/posts", verifyToken, async (req, res) => {
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
});


// Get a specific post (protected)
app.get("/api/posts/:postId", verifyToken, async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post (protected)
app.put("/api/posts/:postId", verifyToken, uploadMiddleware.single("image"), async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
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
});

// Delete a post (protected)
app.delete("/api/posts/:postId", verifyToken, async (req, res) => {
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

// Get comments for a post (protected)
app.get("/api/posts/:postId/comments", verifyToken, async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// Create a comment (protected) – now stores profileImage
app.post("/api/posts/:postId/comments", verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { text, author, profileImage } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }
  try {
    const newComment = new Comment({
      postId,
      author: author || "Anonymous",
      text,
      profileImage: profileImage || "default-avatar.png"
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

// Update a comment (protected)
app.put("/api/posts/:postId/comments/:commentId", verifyToken, async (req, res) => {
  const { postId, commentId } = req.params;
  const { text, currentUser } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }
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
});

// Delete a comment (protected)
app.delete("/api/posts/:postId/comments/:commentId", verifyToken, async (req, res) => {
  const { postId, commentId } = req.params;
  const { currentUser } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }
    if (comment.author !== currentUser) {
      return res.status(403).json({ error: "You can only delete your own comments." });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

// Like/Unlike a post (protected)
app.post("/api/posts/:postId/like", verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { currentUser } = req.body;
  if (!currentUser) {
    return res.status(400).json({ error: "currentUser is required." });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    const index = post.likes.indexOf(currentUser);
    if (index === -1) {
      post.likes.push(currentUser);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ count: post.likes.length, liked: post.likes.includes(currentUser) });
  } catch (error) {
    console.error("Error updating like:", error);
    res.status(500).json({ error: "Failed to update like." });
  }
});

// Report a comment (protected)
app.post("/api/posts/:postId/comments/:commentId/report", verifyToken, async (req, res) => {
  const { postId, commentId } = req.params;
  const { currentUser } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.author === currentUser)
      return res.status(400).json({ error: "You cannot report your own comment." });
    comment.reported = true;
    await comment.save();
    res.json({ message: "Comment reported successfully." });
  } catch (error) {
    console.error("Error reporting comment:", error);
    res.status(500).json({ error: "Failed to report comment." });
  }
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
