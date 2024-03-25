const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Business = require('./bussiness');
const Application = require('./applicationforbussiness');

const Financial = sequelize.define('financial', {
  financial_id: {
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
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  investment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  investment_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  income_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default value for income_amount
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Financial.sync()
  .then(() => {
    console.log('Application table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing Application table:', error);
  });

// Define the foreign key relationships
Financial.belongsTo(User, { foreignKey: 'investor_id', as: 'investor' });
Financial.belongsTo(Business, { foreignKey: 'business_id', as: 'business' });
Financial.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

module.exports = Financial;
