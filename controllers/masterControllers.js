const models = require("../models/index"); 
const sequelize = require("../config/dbConfig"); 
const messages = require("../messages/index");
const result = require("../middleware/result");

exports.testt = async (req, res, next) => {
    try {
        let data = await models.mas_name_titles.findAll();
    // if (get_nametitle == null) {
    //   const error = new Error(messages.error);
    //   throw error;
    // }
    result(res, data);
    } catch (error) {
        next(error);
    }
    
}
     
