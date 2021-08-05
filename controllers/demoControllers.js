const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { ldap } = require("../service/ldap");

exports.demoLdap = async (req, res, next) => {
  try {
    const { username, password } = req.body
    result(res, await ldap({ username, password }));

  } catch (error) {
    next(error);
  }
};
