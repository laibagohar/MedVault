// Medical recommendations 
import ReferenceValue from '../models/referenceValue.js';

export const generateRecommendations = async (testResults, reportType, patientInfo) => {
  try {
    const recommendations = {
      overall: 'normal',
      severity: 'none',
      abnormalTests: [],
      normalTests: [],
      recommendations: [],
      lifestyle: [],
      medicalAdvice: [],
      followUp: []
    };

    // Analyze each test result
    for (const [testName, testData] of Object.entries(testResults)) {
      const analysis = await analyzeTestValue(testName, testData, patientInfo, reportType);
      
      if (analysis.status === 'abnormal') {
        recommendations.abnormalTests.push({
          testName,
          value: testData.value,
          unit: testData.unit,
          normalRange: testData.normalRange,
          severity: analysis.severity,
          interpretation: analysis.interpretation
        });
        
        // Add specific recommendations
        recommendations.recommendations.push(...analysis.recommendations);
        recommendations.lifestyle.push(...analysis.lifestyle);
        recommendations.medicalAdvice.push(...analysis.medicalAdvice);
        
      } else {
        recommendations.normalTests.push({
          testName,
          value: testData.value,
          unit: testData.unit
        });
      }
    }

    // Determine overall status and severity
    if (recommendations.abnormalTests.length === 0) {
      recommendations.overall = 'normal';
      recommendations.severity = 'none';
      recommendations.recommendations.push('All test results are within normal ranges. Continue maintaining a healthy lifestyle.');
    } else {
      recommendations.overall = 'abnormal';
      
      // Determine severity based on abnormal tests
      const severities = recommendations.abnormalTests.map(test => test.severity);
      if (severities.includes('critical')) {
        recommendations.severity = 'critical';
        recommendations.medicalAdvice.unshift('⚠️ URGENT: Consult your doctor immediately due to critical values.');
      } else if (severities.includes('high')) {
        recommendations.severity = 'high';
        recommendations.medicalAdvice.unshift('Important: Schedule an appointment with your doctor soon.');
      } else {
        recommendations.severity = 'moderate';
        recommendations.medicalAdvice.push('Consider consulting your doctor about these results.');
      }
    }

    // Add general follow-up recommendations
    addGeneralRecommendations(recommendations, reportType);

    // Remove duplicates
    recommendations.recommendations = [...new Set(recommendations.recommendations)];
    recommendations.lifestyle = [...new Set(recommendations.lifestyle)];
    recommendations.medicalAdvice = [...new Set(recommendations.medicalAdvice)];

    return {
      success: true,
      data: recommendations
    };

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

// Analyze individual test value with HbA1c status handling
const analyzeTestValue = async (testName, testData, patientInfo, reportType) => {
  const { value, normalRange, status } = testData;
  const analysis = {
    status: 'normal',
    severity: 'none',
    interpretation: '',
    recommendations: [],
    lifestyle: [],
    medicalAdvice: []
  };

  // Skip if no value
  if (!value) {
    return analysis;
  }

  // SPECIAL CASE: HbA1c with status field (from Diabetes reports)
  if (testName === 'HbA1c' && status) {
    if (status === 'Diabetes') {
      analysis.status = 'abnormal';
      analysis.severity = value > 10 ? 'critical' : 'high';
      analysis.interpretation = `HbA1c indicates diabetes (${value}%). Blood sugar control is needed.`;
      analysis.recommendations.push('Follow diabetic diet plan');
      analysis.recommendations.push('Regular blood sugar monitoring');
      analysis.lifestyle.push('30 minutes daily exercise');
      analysis.lifestyle.push('Weight management if overweight');
      analysis.lifestyle.push('Limit refined carbohydrates and sugary foods');
      analysis.medicalAdvice.push('Endocrinologist consultation for diabetes management');
      
      return analysis;
      
    } else if (status === 'Pre-Diabetes') {
      analysis.status = 'abnormal';
      analysis.severity = 'moderate';
      analysis.interpretation = `HbA1c indicates pre-diabetes (${value}%). Lifestyle changes can prevent diabetes.`;
      analysis.recommendations.push('Reduce carbohydrate intake');
      analysis.lifestyle.push('Regular physical activity');
      analysis.lifestyle.push('Weight loss if needed');
      analysis.medicalAdvice.push('Annual diabetes screening');
      
      return analysis;
      
    } else if (status === 'Normal') {
      analysis.interpretation = `HbA1c is normal (${value}%).`;
      return analysis;
    }
  }

  // REGULAR CASE: Check if value is within normal range (for non-HbA1c or HbA1c without status)
  if (!normalRange) {
    // If no normal range, try to analyze HbA1c by value alone
    if (testName === 'HbA1c') {
      const testRecommendations = getTestSpecificRecommendations(testName, value, null, value >= 5.7 ? 'high' : 'normal', patientInfo);
      if (value >= 5.7) {
        analysis.status = 'abnormal';
        analysis.severity = testRecommendations.severity;
        analysis.interpretation = testRecommendations.interpretation;
        analysis.recommendations = testRecommendations.recommendations;
        analysis.lifestyle = testRecommendations.lifestyle;
        analysis.medicalAdvice = testRecommendations.medicalAdvice;
      } else {
        analysis.interpretation = `${testName} is normal (${value}%).`;
      }
    } else {
      analysis.interpretation = `${testName} value is ${value}. Normal range not available.`;
    }
    return analysis;
  }

  // Check if value is within normal range
  let isAbnormal = false;
  let deviationType = '';

  if (typeof normalRange.min === 'number' && typeof normalRange.max === 'number') {
    if (value < normalRange.min) {
      isAbnormal = true;
      deviationType = 'low';
    } else if (value > normalRange.max) {
      isAbnormal = true;
      deviationType = 'high';
    }
  }

  if (!isAbnormal) {
    analysis.interpretation = `${testName} is within normal range.`;
    return analysis;
  }

  // Value is abnormal - generate recommendations
  analysis.status = 'abnormal';
  
  // Get specific recommendations based on test type and deviation
  const testRecommendations = getTestSpecificRecommendations(testName, value, normalRange, deviationType, patientInfo);
  
  analysis.severity = testRecommendations.severity;
  analysis.interpretation = testRecommendations.interpretation;
  analysis.recommendations = testRecommendations.recommendations;
  analysis.lifestyle = testRecommendations.lifestyle;
  analysis.medicalAdvice = testRecommendations.medicalAdvice;

  return analysis;
};

// Get specific recommendations for each test
const getTestSpecificRecommendations = (testName, value, normalRange, deviationType, patientInfo) => {
  const result = {
    severity: 'moderate',
    interpretation: '',
    recommendations: [],
    lifestyle: [],
    medicalAdvice: []
  };

  switch (testName) {
    case 'Hb':
      if (deviationType === 'low') {
        result.severity = value < 8 ? 'critical' : 'high';
        result.interpretation = `Hemoglobin is low (${value} g/dL), suggesting possible anemia.`;
        result.recommendations.push('Iron-rich foods like spinach, red meat, and lentils');
        result.recommendations.push('Vitamin C rich foods to improve iron absorption');
        result.lifestyle.push('Avoid tea/coffee with meals as they reduce iron absorption');
        result.medicalAdvice.push('Blood tests to determine the cause of anemia');
      } else {
        result.interpretation = `Hemoglobin is elevated (${value} g/dL).`;
        result.recommendations.push('Stay well hydrated');
        result.medicalAdvice.push('Further testing to rule out underlying conditions');
      }
      break;

    case 'Total RBC':
      if (deviationType === 'low') {
        result.severity = 'high';
        result.interpretation = `Red blood cell count is low (${value}), indicating possible anemia.`;
        result.recommendations.push('Iron and folate supplementation as advised by doctor');
        result.lifestyle.push('Eat foods rich in iron, folate, and vitamin B12');
        result.medicalAdvice.push('Investigate underlying cause of low RBC count');
      }
      break;

    case 'Platelet Count':
      if (deviationType === 'low') {
        result.severity = value < 50 ? 'critical' : 'high';
        result.interpretation = `Platelet count is low (${value}), increasing bleeding risk.`;
        result.recommendations.push('Avoid contact sports and activities with injury risk');
        result.recommendations.push('Use soft toothbrush, avoid sharp objects');
        result.medicalAdvice.push('Urgent hematologist consultation if platelets < 50,000');
      } else {
        result.severity = 'moderate';
        result.interpretation = `Platelet count is elevated (${value}).`;
        result.medicalAdvice.push('Monitor for clotting disorders');
      }
      break;

    case 'SGPT':
    case 'SGOT':
      if (deviationType === 'high') {
        const ratio = normalRange ? value / normalRange.max : value / 40; // Default ratio if no range
        result.severity = ratio > 10 ? 'critical' : ratio > 3 ? 'high' : 'moderate';
        result.interpretation = `${testName} is significantly elevated (${value} U/L), indicating liver stress.`;
        result.recommendations.push('Complete alcohol cessation');
        result.recommendations.push('Avoid hepatotoxic medications and supplements');
        result.lifestyle.push('Follow a liver-friendly diet (low fat, no alcohol)');
        result.lifestyle.push('Maintain healthy weight and exercise regularly');
        result.medicalAdvice.push('Gastroenterologist consultation recommended');
        if (ratio > 10) {
          result.medicalAdvice.unshift('URGENT: Severe liver enzyme elevation requires immediate medical attention');
        }
      }
      break;

    case 'Bilirubin Total':
      if (deviationType === 'high') {
        result.severity = value > 20 ? 'critical' : value > 5 ? 'high' : 'moderate';
        result.interpretation = `Total bilirubin is elevated (${value} mg/dL), suggesting liver dysfunction or hemolysis.`;
        result.recommendations.push('Avoid alcohol completely');
        result.lifestyle.push('Stay well hydrated');
        result.medicalAdvice.push('Liver function evaluation and possible imaging');
      }
      break;

    case 'HbA1c':
      if (value >= 6.5) {
        result.severity = value > 10 ? 'critical' : 'high';
        result.interpretation = `HbA1c indicates diabetes (${value}%). Blood sugar control is needed.`;
        result.recommendations.push('Follow diabetic diet plan');
        result.recommendations.push('Regular blood sugar monitoring');
        result.lifestyle.push('30 minutes daily exercise');
        result.lifestyle.push('Weight management if overweight');
        result.lifestyle.push('Limit refined carbohydrates and sugary foods');
        result.medicalAdvice.push('Endocrinologist consultation for diabetes management');
      } else if (value >= 5.7) {
        result.severity = 'moderate';
        result.interpretation = `HbA1c indicates pre-diabetes (${value}%). Lifestyle changes can prevent diabetes.`;
        result.recommendations.push('Reduce carbohydrate intake');
        result.lifestyle.push('Regular physical activity');
        result.lifestyle.push('Weight loss if needed');
        result.medicalAdvice.push('Annual diabetes screening');
      }
      break;

    case 'TSH':
      if (deviationType === 'high') {
        result.severity = value > 10 ? 'high' : 'moderate';
        result.interpretation = `TSH is elevated (${value} μU/mL), suggesting hypothyroidism.`;
        result.recommendations.push('Iodine-rich foods like seafood and iodized salt');
        result.lifestyle.push('Regular sleep schedule');
        result.lifestyle.push('Stress management techniques');
        result.medicalAdvice.push('Endocrinologist consultation for thyroid evaluation');
      } else if (deviationType === 'low') {
        result.severity = value < 0.1 ? 'high' : 'moderate';
        result.interpretation = `TSH is low (${value} μU/mL), suggesting hyperthyroidism.`;
        result.recommendations.push('Avoid excessive iodine intake');
        result.lifestyle.push('Limit caffeine and stimulants');
        result.medicalAdvice.push('Thyroid specialist consultation recommended');
      }
      break;

    default:
      result.interpretation = `${testName} is ${deviationType} (${value}).`;
      result.recommendations.push('Consult with your healthcare provider about this result');
  }

  return result;
};

// Add general recommendations based on report type
const addGeneralRecommendations = (recommendations, reportType) => {
  const generalAdvice = {
    'CBC': [
      'Maintain a balanced diet rich in iron, folate, and vitamin B12',
      'Stay hydrated and get adequate sleep',
      'Regular follow-up blood tests as recommended by your doctor'
    ],
    'Liver Function': [
      'Maintain a healthy weight and avoid excessive alcohol',
      'Regular monitoring of liver function tests',
      'Consult your doctor before taking any new medications or supplements'
    ],
    'Diabetes': [
      'Regular blood sugar monitoring as advised',
      'Follow a consistent meal and exercise schedule',
      'Annual eye and foot examinations'
    ],
    'Thyroid': [
      'Take thyroid medications as prescribed (if any)',
      'Regular thyroid function monitoring',
      'Inform doctors about thyroid condition before procedures'
    ]
  };

  if (generalAdvice[reportType]) {
    recommendations.followUp.push(...generalAdvice[reportType]);
  }

  // Universal recommendations
  recommendations.followUp.push(
    'Keep all medical reports for future reference',
    'Discuss results with your primary care physician',
    'Follow up as recommended by your healthcare provider'
  );
};

// Compare with reference values from database
export const compareWithReferenceValues = async (testResults, patientGender, patientAge, reportType) => {
  try {
    const comparisons = {};

    for (const [testName, testData] of Object.entries(testResults)) {
      // Try to find reference values in database
      const referenceValue = await ReferenceValue.findOne({
        where: {
          testCategory: reportType,
          testName: testName,
          gender: [patientGender, 'both'],
          ageMin: { [Op.lte]: patientAge },
          ageMax: { [Op.gte]: patientAge }
        }
      });

      if (referenceValue) {
        const { minValue, maxValue } = referenceValue;
        const isNormal = testData.value >= minValue && testData.value <= maxValue;
        
        comparisons[testName] = {
          value: testData.value,
          referenceMin: minValue,
          referenceMax: maxValue,
          isNormal: isNormal,
          status: isNormal ? 'Normal' : (testData.value < minValue ? 'Low' : 'High')
        };
      } else {
        // Fallback to extracted normal range
        comparisons[testName] = {
          value: testData.value,
          referenceMin: testData.normalRange?.min,
          referenceMax: testData.normalRange?.max,
          isNormal: null, // Cannot determine without proper reference
          status: 'Reference not found'
        };
      }
    }

    return {
      success: true,
      data: comparisons
    };

  } catch (error) {
    console.error('Error comparing with reference values:', error);
    return {
      success: false,
      error: error.message,
      data: {}
    };
  }
};

// Generate summary report
export const generateSummaryReport = (recommendations, patientInfo, reportType) => {
  const summary = {
    patientName: patientInfo.name,
    reportType: reportType,
    overallStatus: recommendations.overall || 'normal',
    severity: recommendations.severity || 'none',
    totalTests: (recommendations.normalTests?.length || 0) + (recommendations.abnormalTests?.length || 0),
    abnormalCount: recommendations.abnormalTests?.length || 0,
    keyFindings: []
  };

  // Key findings - only abnormal tests
  if (recommendations.abnormalTests && recommendations.abnormalTests.length > 0) {
    summary.keyFindings = recommendations.abnormalTests
      .filter(test => test.severity !== 'moderate')
      .map(test => `${test.testName}: ${test.value} ${test.unit} (${test.severity})`)
      .slice(0, 3); // Top 3 critical findings
  } else {
    summary.keyFindings.push('All test parameters are within normal limits');
  }

  return summary;
};

export default {
  generateRecommendations,
  compareWithReferenceValues,
  generateSummaryReport
};