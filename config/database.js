// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('freedb_franchisecoonet', 'freedb_Ranjith', 'SGAVXBmXE2Tx9*y', {
  host: 'sql.freedb.tech',
  dialect: 'mysql',
});

module.exports = sequelize;
