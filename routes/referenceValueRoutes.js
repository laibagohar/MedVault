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

router.route('/')
  .get(getReferenceValues)
  .post(protect, createReferenceValue);

router.route('/category/:category')
  .get(getReferenceValuesByCategory);

router.route('/test/:testName')
  .get(getReferenceValuesByTest);

router.route('/:id')
  .get(getReferenceValueById)
  .put(protect, updateReferenceValue)
  .delete(protect, deleteReferenceValue);

export default router;