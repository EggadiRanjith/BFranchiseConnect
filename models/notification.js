const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path accordingly
const User = require('./user');

const Notification = sequelize.define('notification', {
  notification_id: {
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
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notification_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notification_timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  read_status: {
    type: DataTypes.STRING,
    defaultValue: 'unread', // Adjust default value as needed
  },
});

// Define associations if necessary, e.g., linking a user to notifications
Notification.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Notification.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

module.exports = Notification;
