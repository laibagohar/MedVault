import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createReferenceValue,
  getReferenceValues,
  getReferenceValueById,
  updateReferenceValue,
  deleteReferenceValue,
  getReferenceValuesByCategory,
  getReferenceValuesByTest
} from '../controllers/referenceValueController.js';

const router = express.Router();

router.route('/category/:category')
  .get(getReferenceValuesByCategory);

router.route('/test/:testName')
  .get(getReferenceValuesByTest);

router.route('/')
  .get(getReferenceValues)           // GET /api/referenceValues - Get all
  .post(protect, createReferenceValue); // POST /api/referenceValues - Create

router.route('/:id')
  .get(getReferenceValueById)        // GET /api/referenceValues/:id - Get by ID
  .put(protect, updateReferenceValue)    // PUT /api/referenceValues/:id - Update
  .delete(protect, deleteReferenceValue); // DELETE /api/referenceValues/:id - Delete

export default router;