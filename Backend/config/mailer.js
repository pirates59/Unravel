// mailer.js
const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP service
const transporter = nodemailer.createTransport({
  service: 'gmail', // SMTP service to use
  auth: {
    user: 'lenishaghimire07@gmail.com', 
    pass: 'aycz dckk hich mciz',         
  },
});

// Export the configured transporter for use in other modules
module.exports = transporter;
