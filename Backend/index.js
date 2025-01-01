const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const SignupModel = require("./models/Signup");
const ServiceSelectionModel = require("./models/ServiceSelection");
const Booking = require("./models/Booking");
const InformationSchema = require("./models/Information");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/fyp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ success: false, message: "Invalid email format." });
    }

    try {
        // Check if the user exists
        const user = await SignupModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

        if (!user) {
            return res.json({ success: false, message: "This email is not registered." });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Incorrect password. Please try again." });
        }

        // If everything is valid
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
      if (bookedDates[dateKey].times.length === timeSlots.length) bookedDates[dateKey].isFullyBooked = true;
    });

    res.json(bookedDates); 
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booked dates." });
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

  const [year, month, day] = date.split("-").map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    // Check if the timeslot is already booked
    const existing = await Booking.findOne({ year, month, day, time });
    if (existing) {
      return res.status(400).json({ message: "Timeslot already booked." });
    }

    // Save booking
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
    console.error("Error booking:", err); // Detailed error log
    res.status(500).json({ error: err.message || "Failed to book timeslot." });
  }
});



app.post("/information", async (req, res) => {
  const { firstName, lastName, contact, email } = req.body;

  // Input validation
  const errors = [];
  if (!firstName) errors.push("First name is required.");
  if (!lastName) errors.push("Last name is required.");
  if (!contact || !/^\d{10}$/.test(contact)) errors.push("Valid 10-digit contact number is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required.");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  try {
    // Save to the Information collection
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



app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});