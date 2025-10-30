// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './src/config/config.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDatabase, sequelize };
