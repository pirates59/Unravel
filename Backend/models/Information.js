const mongoose = require('mongoose')
const InformationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
  });
  

  
  module.exports = mongoose.model("Information", InformationSchema);
  