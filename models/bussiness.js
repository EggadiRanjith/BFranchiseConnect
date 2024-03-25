const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly
const User = require('./user');

const Business = sequelize.define('business', {
  business_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Define a foreign key relationship with the User table
    references: {
      model: 'users', // Adjust the model name if your User model has a different name
      key: 'user_id',
    },
  },
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
  admin_approval_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Adjust default value as needed
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  minimum_investment: {
    type: DataTypes.FLOAT, // Numeric data type for minimum investment
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

module.exports = Business;
