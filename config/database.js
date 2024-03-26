// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('FranchiseConnect', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
