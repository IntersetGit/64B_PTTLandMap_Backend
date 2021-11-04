const config = require("./index");

module.exports = {
  development: {
      username: config.DB_USERNAME_DEV,
      password: config.DB_PASSWORD_DEV,
      database: config.DB_NAME_DEV,
      host: config.DB_HOST_DEV,
      port: config.DB_PORT_DEV,
      dialect: config.DB_DIALECT_DEV,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  test: {
      username: config.DB_USERNAME_TEST,
      password: config.DB_PASSWORD_TEST,
      database: config.DB_NAME_TEST,
      host: config.DB_HOST_TEST,
      port: config.DB_PORT_TEST,
      dialect: config.DB_DIALECT_TEST,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  production: {
      username: config.DB_USERNAME_PROD,
      password: config.DB_PASSWORD_PROD,
      database: config.DB_NAME_PROD,
      host: config.DB_HOST_PROD,
      port: config.DB_PORT_PROD,
      dialect: config.DB_DIALECT_PROD,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};