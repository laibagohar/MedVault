import ReferenceValue from '../models/referenceValues.js';

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
      age,
    } = req.body;

    // Validation
    if (!testCategory || !testName || !testUnit || minValue === undefined || maxValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const existingValue = await ReferenceValue.findOne({
      where: {
        testCategory,
        testName,
        gender,
        age
      }
    });

    if (existingValue) {
      return res.status(400).json({
        success: false,
        message: 'A reference value with these criteria already exists'
      });
    }

    const referenceValue = await ReferenceValue.create({
      testCategory,
      testName,
      testUnit,
      minValue,
      maxValue,
      gender,
      age,
      userId: req.user.id
    });

    return res.status(201).json({
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


// GET reference values
export const getReferenceValues = async (req, res) => {
  try {
    const referenceValues = await ReferenceValue.findAll({
      order: [
        ['testCategory', 'ASC'],
        ['testName', 'ASC']
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
      order: [['testName', 'ASC']]
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
    if (referenceValue.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reference value'
      });
    }

    await referenceValue.update(req.body);
    referenceValue = await ReferenceValue.findByPk(req.params.id);

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

    // Check if user owns this reference value
    if (referenceValue.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reference value'
      });
    }

    // Delete reference value
    await referenceValue.destroy();
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}