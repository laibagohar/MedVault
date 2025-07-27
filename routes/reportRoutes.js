
import express from 'express';
import { uploadReport } from '../controllers/reportController.js';
import { upload } from '../utils/uploadfile.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAllReports, getReportById } from '../controllers/reportController.js';
const router = express.Router();

// Route to upload a PDF report
router.post('/upload', upload.single('file'), uploadReport);
router.route('/')
  .get(protect, getAllReports);

router.route('/:id')
  .get(protect, getReportById);
export default router;
