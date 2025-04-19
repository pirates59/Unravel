// db.js
const mongoose = require('mongoose');

// Connection URI for local MongoDB instance and database 'fyp'
const mongoURI = 'mongodb://127.0.0.1:27017/fyp';

// Attempt to connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected'); // Log success message
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = mongoose;
