// User controller logic with Sequelize
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

// User Login Function
export const loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Basic field validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // FIXED: Use the withPassword scope to get password field
    const user = await User.scope('withPassword').findOne({
      where: { 
        email: email.toLowerCase().trim(),
        isActive: true 
      }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    if (!user.password) {
      console.error('User password is undefined');
      return res.status(500).json({
        success: false,
        message: 'User data is corrupted. Please contact support.'
      });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          dob: user.dob,
          title: user.title
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// User Registration Function
export const registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { 
      title,        // mr, ms, mrs
      fullName, 
      gender, 
      dob,            
      email, 
      password, 
      confirmPassword 
    } = req.body;

    // Basic field validation
    if (!title || !fullName || !gender || !dob || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Title validation
    if (!['mr', 'ms', 'mrs'].includes(title.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Title must be one of: Mr, Ms, Mrs'
      });
    }

    // Gender validation
    if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be one of: Male, Female, Other'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ 
      where: { 
        email: email.toLowerCase() 
      } 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Date validation
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Age validation (must be at least 13 years old)
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    if (age < 13) {
      return res.status(400).json({
        success: false,
        message: 'User must be at least 13 years old'
      });
    }

    // Create user
    const user = await User.create({
      title: title.toLowerCase(),
      name: fullName.trim(),
      gender: gender.toLowerCase(),
      dob: dateOfBirth,
      email: email.toLowerCase().trim(),
      password
    });

    // Generate JWT token
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        title: user.title,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        email: user.email,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile
};