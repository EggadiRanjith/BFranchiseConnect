// Import necessary modules
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly

// Define the User model with detailed attributes
const User = sequelize.define('user', {
  // Primary key for the user
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Type of user (e.g., admin, regular user)
  user_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // User's username
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // User's email (unique)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // User's password
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Date of user registration
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Verification status of the user (e.g., pending, verified)
  verification_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Adjust default value as needed
  },
  // User's profile picture (BLOB type for storing images)
  profile_picture: {
    type: DataTypes.BLOB('long'),
    allowNull: true, // Allow null if no image is provided
  },
  // User's contact information
  contact_info: {
    type: DataTypes.STRING,
  },
  // User's address
  address: {
    type: DataTypes.STRING,
  },
  // One-time password for user verification
  otp: {
    type: DataTypes.STRING,
  },
  // Expiry date for the one-time password
  otp_expiry: {
    type: DataTypes.DATE,
  },
  // Flag to indicate if two-factor authentication is enabled for the user
  // Default is set to false, can be changed as needed
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Secret key for two-factor authentication
  two_factor_secret_key: {
    type: DataTypes.STRING,
  },
});

// Export the User model for external use
module.exports = User;
