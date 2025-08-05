import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { 
  registerUser, 
  loginUser, 
  getUserProfile
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').trim().isLength({ min: 2 }),
], registerUser);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], loginUser);

router.get('/profile', protect, getUserProfile);

export default router;