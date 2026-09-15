const tempStore = require('../config/tempStore');

/**
 * Controller for Task 2 Temporary Server-Side Storage
 */

// Handle submission for Task 2
exports.handleTempSubmit = (req, res) => {
  try {
    const { fullName, email, phone, dob, gender, address, city, termsAccepted } = req.body;
    
    // Save to server-side temporary in-memory store
    const newSubmission = tempStore.add({
      fullName,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      termsAccepted
    });

    if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api/')) {
      return res.status(201).json({
        success: true,
        message: 'Registration data validated and stored temporarily on server!',
        data: newSubmission
      });
    }

    // Render result view for traditional form submissions
    return res.render('result', {
      name: newSubmission.fullName,
      email: newSubmission.email,
      message: `Phone: ${newSubmission.phone} | City: ${newSubmission.city} | DOB: ${newSubmission.dob}`,
      submittedAt: new Date(newSubmission.submittedAt).toLocaleString()
    });
  } catch (error) {
    console.error('Temp Submit Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing temporary submission.'
    });
  }
};

// Retrieve all stored temporary submissions
exports.getTempSubmissions = (req, res) => {
  const submissions = tempStore.getAll();
  return res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
};
