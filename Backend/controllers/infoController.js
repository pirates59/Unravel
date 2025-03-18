// controllers/infoController.js
const InformationSchema = require("../models/Information");

exports.saveInformation = async (req, res) => {
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
    const newInformation = new InformationSchema({ firstName, lastName, contact, email });
    await newInformation.save();
    res.status(201).json({ success: true, data: newInformation });
  } catch (err) {
    console.error("Error saving information:", err.message);
    res.status(500).json({ success: false, message: "Error saving information." });
  }
};
