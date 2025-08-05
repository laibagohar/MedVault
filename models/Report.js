import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
 
const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  patientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  patientAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0
    }
  },
  patientGender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  reportType: {
    type: DataTypes.ENUM('CBC', 'Liver Function', 'Thyroid', 'Diabetes', 'Other'),
    allowNull: false
  },
  reportDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  testResults: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'completed'),
    defaultValue: 'pending'
  },
  recommendations: {
    type: DataTypes.JSON,
    allowNull: true
  },
  analyzedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'reports'  
});

Report.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user' 
});

User.hasMany(Report, { 
  foreignKey: 'userId',
  as: 'reports' 
});
export default Report;