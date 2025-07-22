// User routes will go here

import express from 'express';
import { loginUser } from '../controllers/userController.js';

const router = express.Router();

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


export default router;
