const sequelize = require("../config/dbConfig"); //connect db  query string
const messages = require('../messages/index');
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

exports.sequelizeString = async (sql, bind) => {
    const res = await sequelize.query(sql, { bind: bind });
    return res[0].length > 0 ? res[0] : [];
}

exports.sequelizeStringFindOne = async (sql, bind) => {
    const res = await sequelize.query(sql, { bind: bind });
    return res[0].length > 0 ? res[0][0] : null;
}

/* เข้ารหัส Password */
exports.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
};

/* ตรวจสอบ Password */
exports.checkPassword = async (password, passwordDB) => {
    const isValid = await bcrypt.compare(password, passwordDB);
    return isValid;
};

exports.decodeToken = async (auth) => {
    const authHeader = auth;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        const error = new Error(messages.errorUserNot);
        error.statusCode = 402;
        throw error;
    }
    return jwt_decode(token);
};



