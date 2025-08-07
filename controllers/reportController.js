import Report from '../models/Report.js';
import User from '../models/User.js';
import ReferenceValue from '../models/referenceValue.js';
import { uploadMiddleware, validateFile, getFileInfo, deleteFile, determineReportType } from '../services/fileUploadService.js';
import { extractText, validateExtractedText } from '../services/ocrService.js';
import { extractPatientInfo, parseTestResults } from '../services/dataExtractionService.js';
import { generateRecommendations, generateSummaryReport } from '../services/recommendationService.js';
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

// GET a report by ID
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

// for user id
export const getReportByUserId = async (req, res) => {
  try{
  const reports = await Report.findAll({ where: { userId: req.params.id } });
  
  if (!reports) {
    res.status(404);
    throw new Error('Reports not found');
  }
  res.json(reports);
}
catch (error) {
    return res.status(500).json({

      message: 'Could not retrieve the report',
      error: error.message
    });
  }
};

// CREATE new report with file upload and OCR processing (CLEAN VERSION)
export const createReport = async (req, res) => {
  try {
    // Handle file upload
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      }

      try {
        // Validate uploaded file
        const fileValidation = validateFile(req.file);
        if (!fileValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: 'File validation failed',
            errors: fileValidation.errors
          });
        }

        // Get file information
        const fileInfo = getFileInfo(req.file);

        // Extract text from uploaded file
        console.log('🔍 Starting OCR processing...');
        const extractionResult = await extractText(fileInfo.path, fileInfo.mimeType);

        if (!extractionResult.success) {
          deleteFile(fileInfo.path);
          return res.status(400).json({
            success: false,
            message: 'Failed to extract text from file',
            error: extractionResult.error
          });
        }

        console.log(`📊 OCR Confidence: ${extractionResult.confidence}%`);

        // Validate extracted text quality
        const textValidation = validateExtractedText(extractionResult);
        if (!textValidation.isValid) {
          console.warn('⚠️ OCR Quality Warning:', textValidation.warnings);
        }

        // Determine report type
        const reportType = determineReportType(fileInfo.originalName, extractionResult.text);
        console.log('🏷️ Detected Report Type:', reportType);

        // Extract patient information
        console.log('👤 Extracting patient information...');
        const patientInfo = extractPatientInfo(extractionResult.text);

        // Parse test results based on report type
        console.log(`🧪 Parsing ${reportType} test results...`);
        const testParsingResult = parseTestResults(extractionResult.text, reportType);

        if (!testParsingResult.success) {
          console.error('❌ Test parsing failed:', testParsingResult.error);
          // Don't fail completely - continue with empty results
        }

        // Generate recommendations (skip if no test results)
        let recommendationsResult = { success: false, data: null };
        if (testParsingResult.success && Object.keys(testParsingResult.data).length > 0) {
          console.log('💡 Generating recommendations...');
          try {
            recommendationsResult = await generateRecommendations(
              testParsingResult.data,
              reportType,
              patientInfo
            );
          } catch (recError) {
            console.error('⚠️ Recommendation generation failed:', recError.message);
          }
        } else {
          console.log('⚠️ Skipping recommendations - no test results to analyze');
        }

        // Get manual inputs from request body
        const {
          patientName,
          patientEmail,
          patientAge,
          patientGender,
          diagnosis,
          description
        } = req.body;

        // Create report record
        const reportData = {
          // Patient info (prioritize manual input over extracted)
          patientName: patientName || patientInfo.name || 'Unknown',
          patientEmail: patientEmail || req.user.email,
          patientAge: patientAge ? parseInt(patientAge) : patientInfo.age || 0,
          patientGender: patientGender || patientInfo.gender || 'other',

          // Report details
          reportType: reportType,
          reportDate: patientInfo.registrationDate || new Date(),
          testResults: testParsingResult.success ? testParsingResult.data : {},
          diagnosis: diagnosis || 'Auto-generated from OCR',
          description: description || `${reportType} test results processed automatically`,

          // File information
          fileName: fileInfo.originalName,
          filePath: fileInfo.path,
          fileSize: fileInfo.size,
          mimeType: fileInfo.mimeType,

          // Processing results
          recommendations: recommendationsResult.success ? recommendationsResult.data : null,
          analyzedAt: new Date(),
          status: 'completed',

          // User association
          userId: req.user.id
        };

        console.log('💾 Creating report...');

        const report = await Report.create(reportData);

        // Generate summary report
        let summary = {};
        try {
          summary = generateSummaryReport(
            recommendationsResult.data || {},
            patientInfo,
            reportType
          );
        } catch (summaryError) {
          console.error('⚠️ Summary generation failed:', summaryError.message);
        }

        // 🎯 CLEAN RESPONSE FOR FRONTEND (Minimal data only!)
        return res.status(201).json({
          success: true,
          message: 'Report created and processed successfully',
          data: {
            report: report,
            summary: summary,
            extractedPatientInfo: patientInfo
          }
        });

      } catch (processingError) {
        console.error('💥 Report processing error:', processingError);

        // Clean up uploaded file on error
        if (req.file) {
          deleteFile(req.file.path);
        }

        return res.status(500).json({
          success: false,
          message: 'Error processing report',
          error: processingError.message
        });
      }
    });

  } catch (error) {
    console.error('💥 Create report error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// UPDATE report details
export const updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    let report = await Report.findOne({
      where: {
        id: reportId,
        userId: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update allowed fields only
    const allowedUpdates = [
      'patientName',
      'patientEmail', 
      'patientAge',
      'patientGender',
      'diagnosis',
      'description',
      'status'
    ];

    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    await report.update(updates);

    // Fetch updated report with user info
    report = await Report.findByPk(reportId, {
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not update report',
      error: error.message
    });
  }
};

// DELETE report and associated files
export const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findOne({
      where: {
        id: reportId,
        userId: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Delete associated file from filesystem
    if (report.filePath) {
      const deleteResult = deleteFile(report.filePath);
      if (!deleteResult.success) {
        console.warn('Failed to delete file:', deleteResult.message);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete report from database
    await report.destroy();

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
      data: {}
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not delete report',
      error: error.message
    });
  }
};

// REPROCESS report (re-run OCR and analysis)
export const reprocessReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findOne({
      where: {
        id: reportId,
        userId: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (!report.filePath) {
      return res.status(400).json({
        success: false,
        message: 'No file associated with this report'
      });
    }

    try {
      // Re-extract text
      const extractionResult = await extractText(report.filePath, report.mimeType);

      if (!extractionResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Failed to re-extract text from file',
          error: extractionResult.error
        });
      }

      // Re-extract patient info and parse test results
      const patientInfo = extractPatientInfo(extractionResult.text);
      const testParsingResult = parseTestResults(extractionResult.text, report.reportType);

      if (!testParsingResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Failed to re-parse test results',
          error: testParsingResult.error
        });
      }

      // Re-generate recommendations
      let recommendationsResult = { success: false, data: null };
      try {
        recommendationsResult = await generateRecommendations(
          testParsingResult.data,
          report.reportType,
          patientInfo
        );
      } catch (recError) {
        console.error('Recommendation generation failed:', recError.message);
      }

      // Update report with new analysis
      await report.update({
        testResults: testParsingResult.data,
        recommendations: recommendationsResult.success ? recommendationsResult.data : null,
        analyzedAt: new Date(),
        status: 'completed'
      });

      // Generate new summary
      let summary = {};
      try {
        summary = generateSummaryReport(
          recommendationsResult.data || {},
          patientInfo,
          report.reportType
        );
      } catch (summaryError) {
        console.error('Summary generation failed:', summaryError.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Report reprocessed successfully',
        data: {
          report: report,
          summary: summary,
          ocrConfidence: extractionResult.confidence
        }
      });

    } catch (reprocessError) {
      return res.status(500).json({
        success: false,
        message: 'Error during reprocessing',
        error: reprocessError.message
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not reprocess report',
      error: error.message
    });
  }
};

// GET report recommendations
export const getReportRecommendations = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findOne({
      where: {
        id: reportId,
        userId: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (!report.recommendations) {
      return res.status(400).json({
        success: false,
        message: 'No recommendations available for this report'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        reportId: report.id,
        reportType: report.reportType,
        patientName: report.patientName,
        recommendations: report.recommendations
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve recommendations',
      error: error.message
    });
  }
};

// GET reports by type
export const getReportsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['CBC', 'Liver Function', 'Diabetes', 'Thyroid', 'Other'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report type',
        validTypes: validTypes
      });
    }

    const reports = await Report.findAll({
      where: {
        userId: req.user.id,
        reportType: type
      },
      order: [['createdAt', 'DESC']],
      attributes: { 
        exclude: ['filePath']
      }
    });

    return res.status(200).json({
      success: true,
      reportType: type,
      count: reports.length,
      data: reports
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve reports by type',
      error: error.message
    });
  }
};

export default {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  reprocessReport,
  getReportRecommendations,
  getReportsByType
};

