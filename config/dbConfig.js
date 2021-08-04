
const config_env = require("./index");
const env = config_env.NODE_ENV || "development";
const config = require(__dirname + "/config.js")[env];
const Sequelize = require("sequelize");
const sequelize = new Sequelize(`${config.dialect}://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`);
module.exports = sequelize;