import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import {sequelize} from '../config/db.js';
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.ENUM('mr', 'ms', 'mrs'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      if(value) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(value, salt);
      this.setDataValue('password', hashedPassword);
    }
 }
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gender:{
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  }
}, {
  timestamps: true, // createdAt and updatedAt will be managed automatically
  tableName: 'users', // PostgreSQL table name
});
export default User;