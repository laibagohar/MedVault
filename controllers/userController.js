import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { 
      title,    // mr, ms, mrs
      fullName, 
      gender, 
      dob,            
      email, 
      password, 
      confirmPassword 
    } = req.body;

    if (!title || !fullName || !gender || !dob || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // to match users passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (!['mr', 'ms', 'mrs'].includes(title.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Title must be one of: Mr, Ms, Mrs'
      });
    }

    if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be one of: Male, Female, Other'
      });
    }

    // To see if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({
      title: title.toLowerCase(),
      name: fullName,
      gender: gender.toLowerCase(),
      dob: new Date(dob),
      email: email.toLowerCase(),
      password
      // password will be hashed in the User model's beforeCreate hook
    });

    // Generate JWT token
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
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
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// login function
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt for:', email);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name , gender: user.gender , dob: user.dob } });
  } catch (error) {
   console.error('Login error:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
};