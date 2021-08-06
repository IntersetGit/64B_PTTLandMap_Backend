const sequelize = require("../config/dbConfig"); //connect db  query string
const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { ldap } = require("../service/ldap");

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
