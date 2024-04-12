// Import necessary modules
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly
const User = require('./user');

// Define the Message model
const Message = sequelize.define('message', {
  // Define message_id field
  message_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Define sender_id field
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Define receiver_id field
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Define message_content field
  message_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Define timestamp field with default value as current timestamp
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Define read_status field with default value as 'unread'
  read_status: {
    type: DataTypes.STRING,
    defaultValue: 'unread', // Adjust default value as needed
  },
});

// Define associations between Message and User models
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// Export the Message model
module.exports = Message;
