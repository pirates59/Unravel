// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("./config/db"); // Connect to database

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow requests from your frontend and include the Authorization header
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to match your frontend URL
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Static folder for uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/bookingRoutes"));
app.use("/", require("./routes/infoRoutes"));
app.use("/", require("./routes/serviceRoutes"));
app.use("/", require("./routes/postRoutes"));
app.use("/", require("./routes/notificationRoutes"));
app.use("/", require("./routes/roomRoutes"));

// Create HTTP server and attach Socket.IO
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Adjust for production if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Expose io globally so controllers can emit events
global.io = io;


io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
  socket.on("disconnect", () => {
    // Handle disconnect if needed
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
