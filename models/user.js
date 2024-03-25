const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  verification_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Adjust default value as needed
  },
  profile_picture: {
       type: DataTypes.BLOB('long'),
    allowNull: true, // Allow null if no image is provided
  },
  contact_info: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  otp: {
    type: DataTypes.STRING,
  },
  otp_expiry: {
    type: DataTypes.DATE,
  },
  // Assuming 2fa_enabled is optional for users
  // If it's mandatory, you can set allowNull to false
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Adjust default value as needed
  },
  two_factor_secret_key: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
