import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `medical-report-${uniqueSuffix}${extension}`);
  }
});

// File filter for medical reports
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|pdf|tiff|tif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, TIFF) and PDF files are allowed'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// File validation service
export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file uploaded');
    return { isValid: false, errors };
  }

  // Check file size (additional check)
  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size must be less than 10MB');
  }

  // Check file type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/tiff',
    'image/tif',
    'application/pdf'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    errors.push('Invalid file type. Only JPEG, PNG, TIFF, and PDF files are allowed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get file info service
export const getFileInfo = (file) => {
  return {
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimeType: file.mimetype,
    uploadDate: new Date()
  };
};

// Delete file service
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true, message: 'File deleted successfully' };
    }
    return { success: false, message: 'File not found' };
  } catch (error) {
    return { success: false, message: 'Error deleting file', error: error.message };
  }
};

// Check if file exists
export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Determine report type from filename or content
export const determineReportType = (filename, extractedText = '') => {
  const lowerFilename = filename.toLowerCase();
  const lowerText = extractedText.toLowerCase();

  // CBC Detection
  if (lowerFilename.includes('cbc') || 
      lowerText.includes('complete blood count') ||
      lowerText.includes('blood c/e') ||
      lowerText.includes('hematology')) {
    return 'CBC';
  }

  // Liver Function Detection
  if (lowerFilename.includes('liver') ||
      lowerText.includes('liver function') ||
      lowerText.includes('bilirubin') ||
      lowerText.includes('sgpt') ||
      lowerText.includes('sgot')) {
    return 'Liver Function';
  }

  // Diabetes Detection
  if (lowerFilename.includes('diabetes') ||
      lowerFilename.includes('sugar') ||
      lowerText.includes('hba1c') ||
      lowerText.includes('glycosylated hemoglobin') ||
      lowerText.includes('diabetes')) {
    return 'Diabetes';
  }

  // Thyroid Detection
  if (lowerFilename.includes('thyroid') ||
      lowerText.includes('thyroid') ||
      lowerText.includes('tsh') ||
      lowerText.includes('endocrine')) {
    return 'Thyroid';
  }

  // Default
  return 'Other';
};

// Main upload middleware
export const uploadMiddleware = upload.single('medicalReport');

// Export multer instance for custom usage
export { upload };

export default {
  uploadMiddleware,
  validateFile,
  getFileInfo,
  deleteFile,
  fileExists,
  determineReportType
};