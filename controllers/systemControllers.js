const ActiveDirectory = require('activedirectory');
const config = require("../config");
const { filterUsernameSysmUsersService } = require('../service/sysmUsersService');
const { createSysmUsersService } = require('../service/sysmUsersService');
const { createDatProfileUsersService } = require('../service/datProfileUsersService');
const sequelize = require("../config/dbConfig"); //connect db  query string
const uuidv4 = require("uuid");
const result = require('../middleware/result');
const { DecryptCryptoJS } = require('../util');

const connect = {
    development: {
        host: config.LDAP_HOST_DEV,
        url: config.LDAP_URL_DEV,
        search: config.LDAP_SEARCH_DEV,
    },
    test: {
        host: config.LDAP_HOST_TEST,
        url: config.LDAP_URL_TEST,
        search: config.LDAP_SEARCH_TEST,
    },
    production: {
        host: config.LDAP_HOST_PROD,
        url: config.LDAP_URL_PROD,
        search: config.LDAP_SEARCH_PROD,
    },
}

/* สร้าง AD */
exports.createUserAD = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, password, token, roles_id} = req.body;
        const _res = await connectPttAD_(username)
        // console.log(_res);

        if (token) {
            const _decrypt = DecryptCryptoJS(token)
            username = _decrypt.username
            password = _decrypt.password
        }

        if (!_res) {
            const err = new Error('ไม่พบชื่อผู้ใช้ ad')
            err.statsCode = 404
            throw err;
        }

        const __res = await filterUsernameSysmUsersService(username)
        const id = uuidv4.v4()
        if (!__res) {
            await createSysmUsersService({
                id,
                roles_id,
                user_name: username,
                password,
                e_mail: _res.mail,
                created_by: id
            }, transaction)

            await createDatProfileUsersService({
                user_id: id,
                created_by: id,
                first_name: _res.givenName,
                last_name: _res.sn,
                initials: _res.initials,
                e_mail: _res.mail
            }, transaction)
        } else {
            const err = new Error(`มีผู้ใช้ ${username} ในฐานข้อมูล`)
            err.statusCode = 400
            throw err;
        }

        await transaction.commit();
        result(res, id)
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
}

const connectPttAD_ = async (username) => {
    const myPromise = new Promise((resolve, reject) => {
        const { url, search } = connect[config.NODE_ENV]

        const config_ad = {
            url,
            baseDN: `${search}`,
            username: `${config.USER_NAME_AD}@ptt.corp`,
            password: config.PASSWORD_AD
        }
    
        const ad = new ActiveDirectory(config_ad);
        ad.findUser(username, (err, user) => {
            if (err) {
                const _err = { message: 'error'}
                reject(_err);
            }
            if (!user) {
                console.log(user);
                const _err = { message: "ไม่พบชื่อผู้ใช้" }
                reject(_err)
            }
            resolve(user);
        });
    })
    return await myPromise
}