// Import necessary modules
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly
const User = require('./user');

// Define the Business model
const Business = sequelize.define('business', {
  // Primary key for the business table
  business_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Foreign key relationship with the User table
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Adjust the model name if your User model has a different name
      key: 'user_id',
    },
  },
  // Business details
  business_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  industry_type: {
    type: DataTypes.STRING,
  },
  registration_number: {
    type: DataTypes.STRING,
  },
  registered_address: {
    type: DataTypes.STRING,
  },
  contact_info: {
    type: DataTypes.STRING,
  },
  // Approval status and registration date
  admin_approval_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Default value for approval status
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Financial details
  minimum_investment: {
    type: DataTypes.FLOAT,
  },
  investment_details: {
    type: DataTypes.STRING,
  },
  partnership_details: {
    type: DataTypes.STRING,
  },
  franchise_opportunities: {
    type: DataTypes.STRING,
  },
  financial_performance: {
    type: DataTypes.STRING,
  },
  growth_potential: {
    type: DataTypes.STRING,
  },
  // Business strategy and terms
  business_plan: {
    type: DataTypes.STRING,
  },
  exit_strategy: {
    type: DataTypes.STRING,
  },
  terms_and_conditions: {
    type: DataTypes.STRING,
  },
});

// Define associations between User and Business
User.hasOne(Business, { foreignKey: 'user_id' });
Business.belongsTo(User, { foreignKey: 'user_id' });

// Export the Business model
module.exports = Business;
