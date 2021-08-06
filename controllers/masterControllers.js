const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { GetAllTitleNameService } = require("../service/mas_name_titles");

exports.getNameTitle = async (req, res, next) => {
  try {
    result(res, await GetAllTitleNameService());
    
  } catch (error) {
    next(error);
  }
};
