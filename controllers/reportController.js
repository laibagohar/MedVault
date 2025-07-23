import Report from '../models/Report.js';
import { upload } from '../utils/uploadfile.js';





// Controller to handle PDF upload and report creation
export const uploadReport = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file is not a PDF.' });
    }
    console.log('file uploaded successfully', req.file);

    // Extract report data from request body
    const {
      patientName,
      patientEmail,
      patientAge,
      patientGender,
      reportType,
      reportDate,
      testResults,
      diagnosis,
      description,
      status,
      userId
    } = req.body;

    console.log('report data', req.body);

        // Create new report
    const report = await Report.create({
      patientName,
      patientEmail,
      patientAge,
      patientGender,
      reportType,
      reportDate,
      testResults,
      diagnosis,
      description,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status,
      userId
    });

    res.status(201).json({ message: 'Report uploaded successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
