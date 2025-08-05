import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ReferenceValue = sequelize.define('referenceValue', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    testCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    testName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    testUnit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
    },
    ageMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
    },
    ageMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 120
    }, 
}, {
  timestamps: true,
  tableName: 'reference_values'
});
export default ReferenceValue;