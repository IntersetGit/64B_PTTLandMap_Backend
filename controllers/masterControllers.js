const models = require("../models/index");
const sequelize = require("../config/dbConfig");
const messages = require("../messages/index");
const result = require("../middleware/result");
const { GetAllTitleNameService } = require("../service/mas_name_titles");

exports.testt = async (req, res, next) => {
  try {
    result(res, await GetAllTitleNameService());
    
  } catch (error) {
    next(error);
  }
};
