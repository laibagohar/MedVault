import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.ENUM('mr', 'ms', 'mrs'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title is required'
      },
      isIn: {
        args: [['mr', 'ms', 'mrs']],
        msg: 'Title must be mr, ms, or mrs'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Name must be between 2 and 50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email address already exists'
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    },
    set(value) {
      // Automatically lowercase and trim email
      if (value) {
        this.setDataValue('email', value.toLowerCase().trim());
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password is required'
      },
      len: {
        args: [8, 128],
        msg: 'Password must be at least 8 characters long'
      }
    },
    set(value) {
      // FIXED: Add proper validation and error handling
      if (value && typeof value === 'string' && value.length > 0) {
        try {
          const salt = bcrypt.genSaltSync(12);
          const hashedPassword = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hashedPassword);
        } catch (error) {
          console.error('Password hashing error:', error);
          throw new Error('Failed to hash password');
        }
      } else {
        throw new Error('Password is required and must be a string');
      }
    }
  },
  dob: {
    type: DataTypes.DATEONLY, // Only date, no time
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Please provide a valid date of birth'
      }
    }
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
    validate: {
      isIn: {
        args: [['male', 'female', 'other']],
        msg: 'Gender must be male, female, or other'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true, // createdAt and updatedAt
  tableName: 'users', // Explicitly set table name
  
  // Default scope excludes password
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  
  // Named scopes
  scopes: {
    // Include password when needed (for authentication)
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

// Instance method to check password
User.prototype.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Static method to find user by email with password
User.findByEmail = function(email) {
  return this.scope('withPassword').findOne({
    where: { 
      email: email.toLowerCase().trim(),
      isActive: true 
    }
  });
};

export default User;