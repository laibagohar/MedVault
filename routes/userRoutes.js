import express from 'express';
import { loginUser } from '../controllers/userController.js';
import { check } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').trim().isLength({ min: 2 }),
], registerUser);

router.post('/login', [
    // Login route for user authentication
     check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
    check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    loginUser
]);

router.get('/profile', protect, getUserProfile);

export default router;