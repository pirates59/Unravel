// controllers/infoController.js
const InformationSchema = require('../models/Information');

// Save a new Information entry after validating input data
exports.saveInformation = async (req, res) => {
  // Extract and validate incoming fields
  const { firstName, lastName, contact, email } = req.body;
  const errors = [];
  if (!firstName) errors.push('First name is required.');
  if (!lastName) errors.push('Last name is required.');
  if (!contact || !/^\d{10}$/.test(contact)) errors.push('Valid 10-digit contact number is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');

  // If any validation errors, return a 400 response with messages
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  try {
    // Create and save the Information document to MongoDB
    const newInformation = new InformationSchema({ firstName, lastName, contact, email });
    await newInformation.save();
    // Respond with the newly created record
    res.status(201).json({ success: true, data: newInformation });
  } catch (err) {
    console.error('Error saving information:', err.message);
    // Handle unexpected server errors
    res.status(500).json({ success: false, message: 'Error saving information.' });
  }
};
