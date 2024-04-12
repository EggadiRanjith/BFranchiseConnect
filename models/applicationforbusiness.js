// application.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Import the User model
const Business = require('./business'); // Import the Business model

const Application = sequelize.define('application', {
  application_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  investor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  application_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Adjust default value as needed
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  approval_date: {
    type: DataTypes.DATE,
  },
  investment_amount: {
    type: DataTypes.NUMERIC,
    allowNull: false,
  },
  investment_plan_details: {
    type: DataTypes.STRING,
  },
  prior_investment_experience: {
    type: DataTypes.STRING,
  },
  purpose_of_investment: {
    type: DataTypes.STRING,
  },
  duration_of_investment: {
    type: DataTypes.STRING,
  },
  relevant_documents_uploaded: {
    type: DataTypes.STRING,
  },
  investor_verification_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
});

// Define the foreign key relationships
Application.belongsTo(User, { foreignKey: 'investor_id', as: 'investor' });
Application.belongsTo(Business, { foreignKey: 'business_id', as: 'business' });

module.exports = Application;
