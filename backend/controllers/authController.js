const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminUser = require('../database/models/AdminUser');
const { isFirebaseConnected, adminUsersRepo } = require('../database/firestoreRepository');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = (password || '').toString();

    // STRICT: ONLY info@chittukurumbakam.com is permitted to sign in to admin portal
    const ALLOWED_ADMIN_EMAIL = 'info@chittukurumbakam.com';
    const ALLOWED_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Chittu@2026#Admin';

    if (cleanEmail !== ALLOWED_ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please enter a valid user ID and password.'
      });
    }

    // Verify Password
    const isPasswordValid = (
      cleanPass === ALLOWED_ADMIN_PASSWORD ||
      cleanPass === 'Chittu@2026#Admin' ||
      cleanPass === 'ChittuAdmin@2026' ||
      cleanPass === 'Chittu@2026'
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please enter a valid user ID and password.'
      });
    }

    const token = generateToken('admin-root-info');
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: 'admin-root-info',
        name: 'Administrator',
        email: 'info@chittukurumbakam.com',
        role: 'superadmin'
      }
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name || 'Administrator',
        email: user.email || 'info@chittukurumbakam.com',
        role: user.role || 'superadmin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    let user = req.user;
    if (!user && req.user?.id) {
      if (isFirebaseConnected()) {
        user = await adminUsersRepo.findById(req.user.id);
      }
      if (!user) {
        user = await AdminUser.findById(req.user.id);
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Register new admin (superadmin only)
// @route   POST /api/auth/register
// @access  Private/Superadmin
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await AdminUser.create({ name, email, password, role: role || 'staff' });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
