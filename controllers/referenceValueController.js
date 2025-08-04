import ReferenceValue from '../models/referenceValue.js';
// POST reference value
export const createReferenceValue = async (req, res) => {
  try {
    const {
      testCategory,
      testName,
      testUnit,
      minValue,
      maxValue,
      gender,
      ageMin,
      ageMax
    } = req.body;

    // Validation
    if (!testCategory || !testName || !testUnit || minValue === undefined || maxValue === undefined || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (testCategory, testName, testUnit, minValue, maxValue, gender)'
      });
    }
    // Check for existing reference value
    const existingValue = await ReferenceValue.findOne({
      where: {
        testCategory,
        testName,
        gender,
        ageMin: finalAgeMin,
        ageMax: finalAgeMax
      }
    });

    if (existingValue) {
      return res.status(400).json({
        success: false,
        message: 'A reference value with these same criteria already exists'
      });
    }

    const referenceValue = await ReferenceValue.create({
      testCategory,
      testName,
      testUnit,
      minValue,
      maxValue,
      gender,
      ageMin: finalAgeMin,
      ageMax: finalAgeMax
    });

    return res.status(201).json({
      success: true,
      message: 'Reference value created successfully',
      data: referenceValue
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET reference values
export const getReferenceValues = async (req, res) => {
  try {
    const referenceValues = await ReferenceValue.findAll({
      order: [
        ['testCategory', 'ASC'],
        ['testName', 'ASC'],
        ['gender', 'ASC'],
        ['ageMin', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      count: referenceValues.length,
      data: referenceValues
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET values by id
export const getReferenceValueById = async (req, res) => {
  try {
    const referenceValue = await ReferenceValue.findByPk(req.params.id);

    if (!referenceValue) {
      return res.status(404).json({
        success: false,
        message: 'Reference value not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: referenceValue
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET values by category
export const getReferenceValuesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const referenceValues = await ReferenceValue.findAll({
      where: {
        testCategory: category
      },
      order: [
        ['testName', 'ASC'],
        ['gender', 'ASC'],
        ['ageMin', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      category: category,
      count: referenceValues.length,
      data: referenceValues
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET values by test name
export const getReferenceValuesByTest = async (req, res) => {
  try {
    const { testName } = req.params;

    const referenceValues = await ReferenceValue.findAll({
      where: {
        testName: testName
      },
      order: [
        ['testCategory', 'ASC'],
        ['gender', 'ASC'],
        ['ageMin', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      testName: testName,
      count: referenceValues.length,
      data: referenceValues
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update reference values by id
export const updateReferenceValue = async (req, res) => {
  try {
    let referenceValue = await ReferenceValue.findByPk(req.params.id);

    if (!referenceValue) {
      return res.status(404).json({
        success: false,
        message: 'Reference value not found'
      });
    }
    await referenceValue.update(req.body);
    referenceValue = await ReferenceValue.findByPk(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Reference value updated successfully',
      data: referenceValue
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// DELETE reference values by id
export const deleteReferenceValue = async (req, res) => {
  try {
    const referenceValue = await ReferenceValue.findByPk(req.params.id);

    if (!referenceValue) {
      return res.status(404).json({
        success: false,
        message: 'Reference value not found'
      });
    }
    await referenceValue.destroy();
    return res.status(200).json({
      success: true,
      message: 'Reference value deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};