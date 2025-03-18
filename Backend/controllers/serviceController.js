// controllers/serviceController.js
const ServiceSelectionModel = require("../models/ServiceSelection");

exports.selectService = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Error saving the data." });
  }
};
