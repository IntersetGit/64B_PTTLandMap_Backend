const models = require("../models/index"); 
const sequelize = require("../config/dbConfig"); 
const messages = require("../messages/index");
const result = require("../middleware/result");


exports.GetAllTitleNameService = async() => {
    return models.mas_name_titles.findAll()
}