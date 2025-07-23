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

// only pdf files are allowed(update it for jpg and png later)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for now'), false);
    }
};


export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
