const Joi = require("@hapi/joi");
/**
 * File name for request and response model should be same as router file.
 * Define request model with there order in router js file.
 * For example first api in user router is create user so we define createUser schema with key 0.
 */
module.exports = {
    1: {
        body: {
            coordinate: {
                lat:Joi.string(),log:Joi.string()
            },
            name:Joi.string(),
            url: Joi.string()
        },

        model: "streetview 1", // Name of the model
        group: "streetview",
        description: "เพิ่มข้อมูลและแก้ไขพิกัดพื้นที่",
    },
    2: {
        body: {
            id: Joi.string()
        },
        model: "streetview 2",
        group: "streetview",
        description: "ลบข้อมูลพิกัดแผนที่",
    }
};