// Report routes will go here
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllReports, getReportById } from '../controllers/reportController.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllReports);

router.route('/:id')
  .get(protect, getReportById);

export default router;