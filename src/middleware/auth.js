const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const { findUserById } = require('../models/userModel');

function authenticate(req, res, next) {
  try {
   
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return errorResponse(res, 'No token provided', 401);
    }

   
    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Invalid token format', 401);
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const user = findUserById(decoded.id);

    if (!user) {
      return errorResponse(res, 'User no longer exists', 401);
    }

    if (!user.is_active) {
      return errorResponse(res, 'Your account has been deactivated', 403);
    }

   
    req.user = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    
    next();

  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
}

module.exports = { authenticate };