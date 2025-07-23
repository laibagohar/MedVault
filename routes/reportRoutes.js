import express from 'express';
import { uploadReport } from '../controllers/reportController.js';
import { upload } from '../utils/uploadfile.js';

const router = express.Router();

// Route to upload a PDF report
router.post('/upload', upload.single('file'), uploadReport);

export default router;
