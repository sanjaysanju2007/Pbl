const jwt = require('jsonwebtoken');
const AdminUser = require('../database/models/AdminUser');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id === 'default-admin-id') {
      req.user = {
        _id: 'default-admin-id',
        id: 'default-admin-id',
        name: 'Administrator',
        email: 'admin@chittukurumbakam.com',
        role: 'superadmin',
        isActive: true
      };
      return next();
    }

    try {
      req.user = await AdminUser.findById(decoded.id);
    } catch (dbErr) {
      // If DB is offline, allow default admin
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: 'Administrator',
        email: 'admin@chittukurumbakam.com',
        role: 'superadmin',
        isActive: true
      };
      return next();
    }

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Not authorized — user inactive or not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized — token invalid' });
  }
};

// Restrict to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
