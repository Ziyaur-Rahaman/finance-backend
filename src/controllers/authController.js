const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/response');


async function register(req, res) {
  try {
    
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email and password are required', 400);
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 'Please provide a valid email address', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'Email is already registered', 409);
      
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const userId = createUser(name, email, hashedPassword);

    
    return successResponse(res, {
      message: 'Registration successful',
      userId
    }, 201);
    

  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

// LOGIN

async function login(req, res) {
  try {
   
    const { email, password } = req.body;

    
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    
    const user = findUserByEmail(email);
    if (!user) {
      
      return errorResponse(res, 'Invalid email or password', 401);
    
    }

  
    if (!user.is_active) {
      return errorResponse(res, 'Your account has been deactivated. Contact admin.', 403);
      
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }


    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,  
      { expiresIn: '24h' }     
    );

   
    return successResponse(res, {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

module.exports = { register, login };