const models = require("../models/index"); //connect db get data model
const util = require("../util/index"); //connect db  query string
const query = require("../querys/index");
const messages = require('../messages/index');
const md5 = require('md5');
const config = require('../config');
const jwt = require('jsonwebtoken');
const result = require('../middleware/result');

/* เข้าสู่ระบบ */
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const model = {
            username: username,
        }

        //สร้าง token
        const token = await jwt.sign(model, config.JWT_SECRET, { expiresIn: "3h" });
        //decode วันหมดอายุ
        const expires_in = jwt.decode(token);

        result(res, {
            access_token: token,
            expires_in: expires_in.exp
        })

    } catch (error) {
        next(error);
    }
};
