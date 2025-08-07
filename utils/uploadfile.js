import multer from 'multer';
import path from 'path';


// storage for pdf files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure folder exists
    },
    filename: function (req, file, cb) {
        // unique suffix for the file name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // file name with unique suffix and .pdf extension
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Allow PDF, JPG, and PNG files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed'), false);
  }
};


export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
