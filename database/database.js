require('dotenv').config();
const Sequelize = require('sequelize');

const connection = new Sequelize(
  process.env.DB_NAME || 'escoteiros',
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // Garante que a porta do Railway seja usada
    dialect: 'mysql',
    timezone: '-03:00',
    logging: false
  }
);

module.exports = connection;