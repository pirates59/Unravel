
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lenishaghimire07@gmail.com", // Replace with your Gmail address
    pass: "aycz dckk hich mciz",         // Replace with your 16-character app password
  },
});

module.exports = transporter;
