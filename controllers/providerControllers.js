const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const config = require('../config');
const jwt = require('jsonwebtoken');
const result = require('../middleware/result');

/* เข้าสู่ระบบ */
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        

        const model = {
            username: username,
            password: password
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
