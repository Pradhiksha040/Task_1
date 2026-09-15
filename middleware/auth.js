const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cognifyz_super_secret_jwt_key_2026_key';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role || 'User' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Protect Routes Middleware
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'HTTP 401 Unauthorized: Access token missing or invalid.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'HTTP 401 Unauthorized: Invalid or expired token.'
    });
  }
};

// Authorize Roles Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'HTTP 403 Forbidden: You do not have permission to access this resource.'
      });
    }
    next();
  };
};

module.exports = { generateToken, protect, authorize };
