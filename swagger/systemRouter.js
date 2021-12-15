const Joi = require("@hapi/joi");
/**
 * File name for request and response model should be same as router file.
 * Define request model with there order in router js file.
 * For example first api in user router is create user so we define createUser schema with key 0.
 */

module.exports = {
    0: {
        body: {
            username: Joi.string(),
            password: Joi.string(),
            token: Joi.string(),
            roles_id: Joi.string(),
            first_name: Joi.string(),
            last_name: Joi.string(),
            e_mail: Joi.string(),
            is_ad: Joi.boolean()
        },
        model: "systemRouter 0", // Name of the model
        group: "systemRouter",
        description: "เพิ่มข้อมูลผู้ใช้งาน ad ptt",
    },
    1: {
        body: {
            id: Joi.string(),
            roles_id: Joi.string()
        },
        model: "systemRouter 1", // Name of the model
        group: "systemRouter",
        description: "แก้ไขสิทธิ์ผู้ใช้งาน ad ",
    },
    2: {
        parameters: [{
            name: "Parameters",
            in: "",
            required: true,
            type: "string",
            schema: {
                $ref: "#/system/findUserAD",
            }
        }],
        model: "systemRouter 2", // Name of the model
        group: "systemRouter",
        description: "ค้นหาผู้ใช้งาน ad ",
    },
    3: {
        path: {
            id: Joi.string()
        },
        model: "systemRouter 3", // Name of the model
        group: "systemRouter",
        description: "ลบข้อมูลผู้ใช้งานระบบเปลี่ยนสถานะเป็น 2 คือลบ",
    },
    4: {
        body: {
            id: Joi.string(),
            info_form: {
                username: Joi.string(),
                password: Joi.string()
            },
        },
        model: "systemRouter 4", // Name of the model
        group: "systemRouter",
        description: "แก้ไข้อัพเดทข้อมูล ad ที่ใช้ในการค้นหา ad",
    },
    5: {
        query: [
            {
                model: "systemRouter 5", // Name of the model
                group: "systemRouter",
                description: "เรียกข้อมูลสิทธิ์ผู้ใช้งาน",
            }
        ]

    },
    6: {
        body: {
            user_name: Joi.string(),
            first_name:Joi.string(),
            last_name: Joi.string(),
            user_id: Joi.string(),
            e_mail: Joi.string()
        },
        model: "systemRouter 6", // Name of the model
        group: "systemRouter",
        description: "แก้ไข้อัพเดทข้อมูล non ad",
    }
}