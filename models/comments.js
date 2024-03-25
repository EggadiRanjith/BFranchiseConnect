const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Import the User model

const Comment = sequelize.define('comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

// Set up the association
Comment.belongsTo(User, {
  foreignKey: 'user_id', // Adjust the foreign key based on your actual setup
});

module.exports = Comment;
