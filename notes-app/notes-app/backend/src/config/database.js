const path = require('node:path');
const { Sequelize } = require('sequelize');
const logger = require('./logger');

// require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const isTest = process.env.NODE_ENV === 'test';

// In test mode we default to SQLite in-memory so `npm test` runs anywhere
// without needing a real PostgreSQL server. In dev/production, PostgreSQL is used.
const sequelize = isTest
  ? new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
  : new Sequelize(
      process.env.DB_NAME || 'notes_app',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres123',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: (msg) => logger.debug(msg),
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connection has been established successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Unable to connect to the database');
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
