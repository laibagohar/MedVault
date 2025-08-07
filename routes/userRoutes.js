import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { check } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
const userRoutes = express.Router();

userRoutes.post('/login', [
    // Login route for user authentication
     check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
    check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    loginUser
]);
userRoutes.post('/register', [
    check('name')
    .notEmpty().withMessage('Name is required'),
    check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
    check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required')
    .isLength({ min: 8 }).withMessage('Confirm Password must be at least 8 characters long'),
    registerUser
]);
 
//userRoutes.get('/profile', protect, getUserProfile);

export default userRoutes;