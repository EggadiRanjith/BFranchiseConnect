const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly
const User = require('./user');

const Message = sequelize.define('message', {
  message_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  read_status: {
    type: DataTypes.STRING,
    defaultValue: 'unread', // Adjust default value as needed
  },
});

// Define associations if necessary, e.g., linking a user to messages
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

module.exports = Message;
