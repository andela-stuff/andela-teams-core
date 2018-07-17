require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DATABASE_DEV,
    dialect: 'postgres',
    host: '127.0.0.1',
    operatorsAliases: false,
    password: process.env.DATABASE_DEV_PASSWORD,
    username: process.env.DATABASE_DEV_USERNAME,
    url: process.env.DATABASE_DEV_URL
  },
  test: {
    database: process.env.DATABASE_TEST,
    dialect: 'postgres',
    host: '127.0.0.1',
    operatorsAliases: false,
    password: process.env.DATABASE_TEST_PASSWORD,
    username: process.env.DATABASE_TEST_USERNAME,
    url: process.env.DATABASE_TEST_URL
  },
  production: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    operatorsAliases: false,
  },
  SECRET: process.env.SECRET,
  GITHUB_ORGANIZATION: process.env.GITHUB_ORGANIZATION,
  GITHUB_USER_AGENT: process.env.GITHUB_USER_AGENT,
  GITHUB_USER_TOKEN: process.env.GITHUB_USER_TOKEN,
  SLACK_BOT_ID: process.env.SLACK_BOT_ID,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_CUSTOM_BOT_ID: process.env.SLACK_CUSTOM_BOT_ID,
  SLACK_CUSTOM_BOT_TOKEN: process.env.SLACK_CUSTOM_BOT_TOKEN,
  SLACK_USER_TOKEN: process.env.SLACK_USER_TOKEN,
};
