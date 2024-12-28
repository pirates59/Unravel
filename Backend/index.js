const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const SignupModel = require("./models/Signup");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/fyp");

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

  

app.listen(3001, () => {
    console.log("Server is running");
});
