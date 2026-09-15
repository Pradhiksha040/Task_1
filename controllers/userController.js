const User = require('../models/User');
const tempStore = require('../config/tempStore');
const { getDbStatus } = require('../config/db');
const { invalidateCachePattern } = require('../config/redis');

/**
 * Task 5 RESTful API User Controller
 */

// GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    let users = [];

    if (getDbStatus()) {
      users = await User.find().select('-password').sort({ createdAt: -1 });
    } else {
      users = tempStore.getAll();
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let user;

    if (getDbStatus()) {
      user = await User.findById(id).select('-password');
    } else {
      user = tempStore.getAll().find(u => u.id.toString() === id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `HTTP 404: User not found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users
exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, phone, dob, gender, address, city, password } = req.body;

    let newUser;

    if (getDbStatus()) {
      newUser = await User.create({
        fullName,
        email,
        phone,
        dob,
        gender,
        address,
        city,
        password: password || 'DefaultPass123!'
      });
    } else {
      newUser = tempStore.add({
        fullName,
        email,
        phone,
        dob,
        gender,
        address,
        city,
        termsAccepted: true
      });
    }

    // Invalidate users cache (Task 8)
    invalidateCachePattern('cache:/api/users');

    return res.status(201).json({
      success: true,
      message: 'User created successfully via REST API',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, city } = req.body;

    let updatedUser;

    if (getDbStatus()) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { fullName, email, phone, city },
        { new: true, runValidators: true }
      ).select('-password');
    } else {
      const all = tempStore.getAll();
      const target = all.find(u => u.id.toString() === id);
      if (target) {
        if (fullName) target.fullName = fullName;
        if (email) target.email = email;
        if (phone) target.phone = phone;
        if (city) target.city = city;
        updatedUser = target;
      }
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `HTTP 404: Cannot update. User not found with ID ${id}`
      });
    }

    // Invalidate cache (Task 8)
    invalidateCachePattern('cache:/api/users');

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (getDbStatus()) {
      const user = await User.findByIdAndDelete(id);
      if (user) deleted = true;
    } else {
      const idx = tempStore.submissions.findIndex(u => u.id.toString() === id);
      if (idx !== -1) {
        tempStore.submissions.splice(idx, 1);
        deleted = true;
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `HTTP 404: Cannot delete. User not found with ID ${id}`
      });
    }

    // Invalidate cache (Task 8)
    invalidateCachePattern('cache:/api/users');

    return res.status(200).json({
      success: true,
      message: `User record with ID ${id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
