// Auth middleware will go here
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protects routes that require login
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Please log in first.' 
      });
    }
    
    try {
      // token verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // finding the user without sending password
      const user = await User.findByPk(decoded.id, { 
        attributes: { exclude: ['password'] } 
      });
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found or deleted' 
        });
      }
      
      // Add user to request for use in protected routes
      req.user = user;
      next();
      
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};