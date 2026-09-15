const User = require('../models/User');
const tempStore = require('../config/tempStore');
const { getDbStatus } = require('../config/db');
const { generateToken } = require('../middleware/auth');
const jobQueue = require('../services/jobQueue');

/**
 * Task 6 Authentication Controller
 */

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, dob, gender, address, city, password, termsAccepted } = req.body;

    let savedUser;

    if (getDbStatus()) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email address already exists.'
        });
      }

      savedUser = await User.create({
        fullName,
        email,
        phone,
        dob,
        gender,
        address,
        city,
        password,
        termsAccepted: Boolean(termsAccepted)
      });
    } else {
      // Fallback in-memory store if DB is offline
      savedUser = tempStore.add({
        fullName,
        email,
        phone,
        dob,
        gender,
        address,
        city,
        password,
        termsAccepted
      });
    }

    // Task 8: Trigger Asynchronous Background Job (Welcome Email Simulation)
    const job = jobQueue.enqueue('WELCOME_EMAIL_JOB', {
      userId: savedUser._id || savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName
    });

    // Task 6: Generate JWT Auth Token
    const token = generateToken(savedUser);

    return res.status(201).json({
      success: true,
      message: 'User registration successful! Welcome aboard.',
      token,
      user: {
        id: savedUser._id || savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role || 'User'
      },
      jobId: job.id
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    let user;

    if (getDbStatus()) {
      user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
    } else {
      // Check tempStore fallback
      user = tempStore.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id || user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'User'
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.'
  });
};
