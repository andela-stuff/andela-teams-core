require('dotenv').config();

export default {
  development: {
    url: process.env.DATABASE_DEV_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  secret: process.env.SECRET,
};
