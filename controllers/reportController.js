// Report controller logic will go here
import Report from '../models/Report.js';

import { upload } from '../utils/uploadfile.js';
import User from '../models/User.js';




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


export const getAllReports = async (req, res) => {
  try {
    // Find all reports of a specific user
    const reports = await Report.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: { 
        exclude: ['filePath']
      }
    });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve reports',
      error: error.message
    });
  }
};


// get a report by ID
export const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findOne({
      where: { 
        id: reportId,
        userId: req.user.id 
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name'] 
        }
      ]
    });

    // Check if the report exists
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve the report',
      error: error.message
    });
  }
};

