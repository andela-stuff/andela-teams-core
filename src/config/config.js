require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DATABASE_DEV,
    dialect: 'postgres',
    host: '127.0.0.1',
    password: process.env.DATABASE_DEV_PASSWORD,
    username: process.env.DATABASE_DEV_USERNAME,
    url: process.env.DATABASE_DEV_URL
  },
  test: {
    database: process.env.DATABASE_TEST,
    dialect: 'postgres',
    host: '127.0.0.1',
    password: process.env.DATABASE_TEST_PASSWORD,
    username: process.env.DATABASE_TEST_USERNAME,
    url: process.env.DATABASE_TEST_URL
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  secret: process.env.SECRET,
};
