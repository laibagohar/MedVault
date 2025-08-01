import express from 'express';
import userRoutes from './userRoutes.js';
import reportRoutes from './reportRoutes.js';
import ReferenceValueRoutes from './referenceValueRoutes.js';

const apiRoutes = express.Router();

router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/referenceValues', ReferenceValueRoutes);

export default apiRoutes;