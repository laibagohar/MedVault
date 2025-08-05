import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Try importing pdf-parse
let pdf;
try {
  pdf = await import('pdf-parse');
  pdf = pdf.default || pdf;
} catch (error) {
  console.warn('pdf-parse module not available, PDF processing will be limited');
  pdf = null;
}

// OCR Configuration 
const ocrConfig = {
  logger: m => console.log('OCR Progress:', m),
  tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,()-/: %μ',
  tessedit_pageseg_mode: Tesseract.PSM.AUTO,
  preserve_interword_spaces: '1'
};

// Preprocess image for better OCR accuracy
const preprocessImage = async (imagePath) => {
  try {
    const outputPath = imagePath.replace(path.extname(imagePath), '_processed.png');
    
    await sharp(imagePath)
      .resize(null, 1200, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .normalize()
      .sharpen()
      .png({ quality: 100 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return imagePath;
  }
};

// Extract text from image using Tesseract OCR
export const extractTextFromImage = async (imagePath) => {
  try {
    console.log('Starting OCR for image:', imagePath);
    
    // Preprocess image for better accuracy
    const processedImagePath = await preprocessImage(imagePath);
    
    // Perform OCR
    const { data: { text, confidence } } = await Tesseract.recognize(
      processedImagePath,
      'eng',
      {
        ...ocrConfig,
        tessedit_char_whitelist: undefined // Allow all characters for medical terms
      }
    );

    // Clean up processed image if it's different from original
    if (processedImagePath !== imagePath && fs.existsSync(processedImagePath)) {
      fs.unlinkSync(processedImagePath);
    }

    console.log(`OCR completed with confidence: ${confidence}%`);
    
    return {
      success: true,
      text: text.trim(),
      confidence: confidence,
      type: 'image'
    };

  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: error.message,
      text: '',
      confidence: 0,
      type: 'image'
    };
  }
};

// Extract text from PDF
export const extractTextFromPDF = async (pdfPath) => {
  try {
    if (!pdf) {
      return {
        success: false,
        error: 'PDF processing not available. Please upload an image instead.',
        text: '',
        confidence: 0,
        type: 'pdf'
      };
    }

    console.log('Extracting text from PDF:', pdfPath);
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    console.log('PDF text extraction completed');
    
    return {
      success: true,
      text: data.text.trim(),
      confidence: 100,
      pages: data.numpages,
      type: 'pdf'
    };

  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      error: error.message,
      text: '',
      confidence: 0,
      type: 'pdf'
    };
  }
};

// Main text extraction function
export const extractText = async (filePath, mimeType) => {
  try {
    let result;

    if (mimeType === 'application/pdf') {
      result = await extractTextFromPDF(filePath);
    } else if (mimeType.startsWith('image/')) {
      result = await extractTextFromImage(filePath);
    } else {
      throw new Error('Unsupported file type for text extraction');
    }

    // Post-process extracted text
    if (result.success && result.text) {
      result.processedText = postProcessText(result.text);
    }

    return result;

  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      success: false,
      error: error.message,
      text: '',
      confidence: 0
    };
  }
};

// Post-process extracted text for better parsing
const postProcessText = (text) => {
  return text
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .replace(/\b0CR\b/gi, 'OCR')
    .replace(/\bl\b/g, '1') 
    .replace(/\bO\b/g, '0') 
    // Fix common medical abbreviations
    .replace(/\bHb\s*A\s*1\s*C\b/gi, 'HbA1C')
    .replace(/\bT\s*S\s*H\b/gi, 'TSH')
    .replace(/\bS\s*G\s*P\s*T\b/gi, 'SGPT')
    .replace(/\bS\s*G\s*O\s*T\b/gi, 'SGOT')
    .replace(/\bR\s*B\s*C\b/gi, 'RBC')
    .replace(/\bW\s*B\s*C\b/gi, 'WBC')
    .replace(/\bH\s*C\s*T\b/gi, 'HCT')
    .replace(/\bM\s*C\s*V\b/gi, 'MCV')
    .replace(/\bM\s*C\s*H\b/gi, 'MCH')
    .replace(/\bM\s*C\s*H\s*C\b/gi, 'MCHC')
    // Clean up extra spaces
    .trim();
};

// Validate extracted text quality
export const validateExtractedText = (extractedResult) => {
  const { text, confidence } = extractedResult;
  
  const validationResult = {
    isValid: true,
    warnings: [],
    suggestions: []
  };

  // Check confidence level
  if (confidence < 70) {
    validationResult.warnings.push('Low OCR confidence. Results may be inaccurate.');
    validationResult.suggestions.push('Try uploading a higher quality image.');
  }

  // Check text length
  if (text.length < 50) {
    validationResult.warnings.push('Very little text extracted.');
    validationResult.suggestions.push('Ensure the image is clear and contains visible text.');
  }

  // Check for medical terms
  const medicalTerms = ['patient', 'test', 'result', 'normal', 'value', 'range', 'lab', 'report'];
  const hasMedicalTerms = medicalTerms.some(term => 
    text.toLowerCase().includes(term)
  );

  if (!hasMedicalTerms) {
    validationResult.warnings.push('No medical terms detected in extracted text.');
    validationResult.suggestions.push('Verify that the uploaded file is a medical report.');
  }

  // If there are warnings, mark as potentially invalid
  if (validationResult.warnings.length > 2) {
    validationResult.isValid = false;
  }

  return validationResult;
};

// Export all functions
export default {
  extractText,
  extractTextFromImage,
  extractTextFromPDF,
  validateExtractedText,
  postProcessText
};