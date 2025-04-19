// controllers/bookingController.js
const Booking      = require("../models/Booking");
const transporter  = require("../config/mailer");  

// Helper to normalize date
function normalizeToUTC(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// Get booked dates
exports.getBookedDates = async (req, res) => {
  const { month, year } = req.query;
  try {
    const bookings  = await Booking.find({ month, year });
    const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
    const bookedDates = {};

    bookings.forEach(bk => {
      const key = `${bk.year}-${bk.month}-${bk.day}`;
      bookedDates[key] = bookedDates[key] || { times: [], isFullyBooked: false };
      bookedDates[key].times.push(bk.time);
      if (bookedDates[key].times.length === timeSlots.length) {
        bookedDates[key].isFullyBooked = true;
      }
    });

    res.json(bookedDates);
  } catch (err) {
    console.error("Error fetching booked dates:", err);
    res.status(500).json({ success: false, message: "Error fetching bookings." });
  }
};

// Book a timeslot and send confirmation email
exports.bookTimeslot = async (req, res) => {
  const { date, time, firstName, lastName, contact, email, service, therapist } = req.body;
  if (!date || !time || !firstName || !lastName || !contact || !email || !service || !therapist) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const dt    = normalizeToUTC(date);
    const year  = dt.getUTCFullYear();
    const month = dt.getUTCMonth() + 1;
    const day   = dt.getUTCDate();

    const existing = await Booking.findOne({ year, month, day, time });
    if (existing) {
      return res.status(400).json({ message: "Timeslot already booked." });
    }

    const booking = new Booking({ year, month, day, time, firstName, lastName, contact, email, service, therapist });
    await booking.save();

    // send confirmation email
    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: "Your Appointment is Confirmed",
      text:
        `Hello ${firstName} ${lastName},\n\n` +
        `Your appointment for ${service} with ${therapist} has been booked on ${date} at ${time}.\n\n` +
        `We look forward to seeing you!\n\n— The Therapy Center`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) ("Email error:", err);
      else     ("Email sent:", info.response);
    });

    res.status(201).json({ message: "Booking successful!" });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ error: err.message || "Failed to book timeslot." });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find();
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch appointments." });
  }
};
