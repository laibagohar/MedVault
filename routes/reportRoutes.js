import express from 'express';
import { uploadReport } from '../controllers/reportController.js';
import { upload } from '../utils/uploadfile.js';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';

import { 
  getAllReports, 
  getReportById, 
  getReportByUserId,
  createReport,
  updateReport,
  deleteReport,
  reprocessReport,
  getReportRecommendations,
  getReportsByType
} from '../controllers/reportController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAllReports)      // GET /api/reports - Get all user reports
  .post(createReport);     // POST /api/reports - Create new report with file upload

router.route('/:id')
  .get(protect, getReportById);
router.route('/getReportByUserId/:id')
  .get(protect, getReportByUserId);


router.use(protect);
router.route('/')
  .get(getAllReports)      // GET /api/reports - Get all user reports
  .post(createReport);     // POST /api/reports - Create new report with file upload

router.route('/:id')
  .get(getReportById)      // GET /api/reports/:id - Get specific report
  .put(updateReport)       // PUT /api/reports/:id - Update report
  .delete(deleteReport);   // DELETE /api/reports/:id - Delete report

router.route('/:id/reprocess')
  .post(reprocessReport);  // POST /api/reports/:id/reprocess - Re-run OCR analysis

router.route('/:id/recommendations')
  .get(getReportRecommendations); // GET /api/reports/:id/recommendations - Get recommendations

router.route('/type/:type')
  .get(getReportsByType);  // GET /api/reports/type/CBC - Get reports by type

export default router;