// Required modules
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Import the User model

// Define the Comment model
const Comment = sequelize.define('comment', {
  // Comment ID
  comment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // User ID associated with the comment
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Post ID associated with the comment
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Content of the comment
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Timestamp when the comment was created
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  // Timestamp when the comment was last updated
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

// Set up the association between Comment and User models
Comment.belongsTo(User, {
  foreignKey: 'user_id', // Adjust the foreign key based on your actual setup
});

// Export the Comment model
module.exports = Comment;
