const mongoose = require('mongoose')
const BookingSchema = new mongoose.Schema({
    year: Number,
    month: Number,
    day: Number,
    time: String,
  });
  

  
  module.exports = mongoose.model("Booking", BookingSchema);
  