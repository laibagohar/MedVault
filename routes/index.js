import express from 'express';
import userRoutes from './userRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

export default router;