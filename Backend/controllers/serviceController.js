// controllers/serviceController.js
const ServiceSelectionModel = require('../models/ServiceSelection');

// Handle service selection requests
exports.selectService = async (req, res) => {
  // Extract required fields from request body
  const { service, therapist, finalize } = req.body;

  // Validate presence of service and therapist
  if (!service || !therapist) {
    return res
      .status(400)
      .json({ success: false, message: 'Service and therapist are required.' });
  }

  try {
    // If finalize flag is true, persist the selection to the database
    if (finalize) {
      const newSelection = await ServiceSelectionModel.create({ service, therapist });
      return res.status(201).json({ success: true, data: newSelection });
    }

    // Otherwise temporary storage without saving
    return res
      .status(200)
      .json({ success: true, message: 'Selection temporarily stored.' });
  } catch (err) {
    console.error('Error saving service selection:', err.message);
    // Handle server errors during creation
    res
      .status(500)
      .json({ success: false, message: 'Error saving the data.' });
  }
};
