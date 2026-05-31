require('dotenv').config();
const Sequelize = require('sequelize');

const connection = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      timezone: '-03:00',
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME || 'escoteiros',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        timezone: '-03:00',
        logging: false
      }
    );

module.exports = connection;