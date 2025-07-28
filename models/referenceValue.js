import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const ReferenceValue = sequelize.define('referenceValue', {
    id: {
        type: DataTypes.UUId,
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
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

ReferenceValue.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ReferenceValue, { foreignKey: 'userId' });

export default ReferenceValue;