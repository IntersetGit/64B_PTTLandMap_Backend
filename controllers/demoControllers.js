const sequelize = require("../config/dbConfig"); //connect db  query string
const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { ldap } = require("../service/ldapService");
const { error } = require("../messages/index");

exports.demoLdap = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { username, password } = req.body

    const _res = await ldap({ user_name: username, password }, transaction)

    result(res, _res);

  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};


exports.demoShap = async (req, res, next) => {
  try {
   
  //  shap('../public/testShapfile/GIS_PatternData.gdb.zip').then(res_ => {
  //    console.log(res_);
  //  })

    // result(res, await shp.combine([shp.parseShp('../public/testShapfile/GIS_PatternData.gdb.zip')])) 

  } catch (error) {
    next(error);
  }
}