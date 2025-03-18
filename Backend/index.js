
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("./config/db"); // Connect to database

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Static folder for uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// Connect to database
require("./config/db");

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/bookingRoutes"));
app.use("/", require("./routes/infoRoutes"));

app.use("/", require("./routes/serviceRoutes"));
app.use("/", require("./routes/postRoutes"));
app.use("/", require("./routes/notificationRoutes"));
// Create HTTP server and attach Socket.IO
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // adjust for production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Expose io globally so controllers can emit events
global.io = io;

// When a client connects, have them join a room (using their unique identifier)
io.on("connection", (socket) => {
 

  // Listen for a "join" event with the user's identifier (e.g. username or id)
  socket.on("join", (userId) => {
   
    socket.join(userId);
  });

  socket.on("disconnect", () => {
  
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});