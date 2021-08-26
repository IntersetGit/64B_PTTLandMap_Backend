const sequelize = require("../config/dbConfig"); //connect db  query string
const messages = require('../messages/index');
const config = require('../config');
const jwt = require('jsonwebtoken');
const result = require('../middleware/result');
const { ldap } = require("../service/ldapService");
const { updateSysmUsersService } = require("../service/sysmUsersService");
const { EncryptCryptoJS, DecryptCryptoJS, encryptPassword } = require('../util');
const { filterUsernameSysmUsersService, createSysmUsersService } = require('../service/sysmUsersService')
const { createDatProfileUsersService } = require('../service/datProfileUsersService')
const { errorRegister } = require('../messages')

const refreshTokens = []

/* เข้าสู่ระบบ */
exports.loginControllers = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, password } = req.body;

        const _user = await filterUsernameSysmUsersService(username)

        if (_user) {
            if (_user.roles_id != "8a97ac7b-01dc-4e06-81c2-8422dffa0ca2") {
                const _res = await ldap({ user_name: username, password }, transaction)

                const model = {
                    sysm_id: _res.id,
                    roles_id: _res.roles_id,
                    code_ldap: _res.code_ldap,
                    roles_name: _res.roles_name,
                    note: _res.note,
                    user_name: _res.user_name,
                    e_mail: _res.e_mail,
                    note: _res.note,
                    first_name: _res.first_name,
                    last_name: _res.last_name,
                    initials: _res.initials,
                    company: _res.company,
                    department: _res.department,
                    job_title: _res.job_title,
                    office: _res.office,
                    web_page: _res.web_page,
                    phone: _res.phone,
                    address: _res.address,
                    description: _res.description
                }

                //สร้าง token
                const token = await generateAccessToken(model)
                const refreshToken = await jwt.sign({ token: EncryptCryptoJS(model) }, config.JWT_SECRET_REFRESH);
                //decode วันหมดอายุ
                const expires_in = jwt.decode(token);

                refreshTokens.push(refreshToken)
                await updateSysmUsersService({
                    id: _res.id,
                    last_login: new Date(),
                    update_by: _res.id,
                })
                result(res, {
                    access_token: token,
                    refresh_token: refreshToken,
                    expires_in: expires_in.exp
                })
            } else {
                const filter_user = await filterUsernameSysmUsersService(username)

                if (!filter_user) {
                    const sysm_users_admin = await createSysmUsersService({
                        roles_id: "8a97ac7b-01dc-4e06-81c2-8422dffa0ca2",
                        user_name: username,
                        password: await encryptPassword(password),

                    }, transaction)

                    await createDatProfileUsersService({
                        user_id: sysm_users_admin,
                        first_name: "admin",
                        last_name: "admin",
                        created_by: sysm_users_admin
                    }, transaction)

                    await transaction.commit();
                }

                const __user = await filterUsernameSysmUsersService(username)

                const model = {
                    sysm_id: __user.id,
                    roles_id: __user.roles_id,
                    code_ldap: __user.code_ldap,
                    roles_name: __user.roles_name,
                    note: __user.note,
                    user_name: __user.user_name,
                    e_mail: __user.e_mail,
                    note: __user.note,
                    first_name: __user.first_name,
                    last_name: __user.last_name,
                    initials: __user.initials,
                    company: __user.company,
                    department: __user.department,
                    job_title: __user.job_title,
                    office: __user.office,
                    web_page: __user.web_page,
                    phone: __user.phone,
                    address: __user.address,
                    description: __user.description
                }

                //สร้าง token
                const token = await generateAccessToken(model)
                const refreshToken = await jwt.sign({ token: EncryptCryptoJS(model) }, config.JWT_SECRET_REFRESH);
                //decode วันหมดอายุ
                const expires_in = jwt.decode(token);

                refreshTokens.push(refreshToken)
                await updateSysmUsersService({
                    id: __user.id,
                    last_login: new Date(),
                    update_by: __user.id,
                })
                result(res, {
                    access_token: token,
                    refresh_token: refreshToken,
                    expires_in: expires_in.exp
                })
            }
        } else {
            if (!_user) {
                const sysm_users_admin = await createSysmUsersService({
                    roles_id: "8a97ac7b-01dc-4e06-81c2-8422dffa0ca2",
                    user_name: username,
                    password: await encryptPassword(password),

                }, transaction)

                await createDatProfileUsersService({
                    user_id: sysm_users_admin,
                    first_name: "admin",
                    last_name: "admin",
                    created_by: sysm_users_admin
                }, transaction)

                await transaction.commit();
            }

            const __user = await filterUsernameSysmUsersService(username)

            const model = {
                sysm_id: __user.id,
                roles_id: __user.roles_id,
                code_ldap: __user.code_ldap,
                roles_name: __user.roles_name,
                note: __user.note,
                user_name: __user.user_name,
                e_mail: __user.e_mail,
                note: __user.note,
                first_name: __user.first_name,
                last_name: __user.last_name,
                initials: __user.initials,
                company: __user.company,
                department: __user.department,
                job_title: __user.job_title,
                office: __user.office,
                web_page: __user.web_page,
                phone: __user.phone,
                address: __user.address,
                description: __user.description
            }

            //สร้าง token
            const token = await generateAccessToken(model)
            const refreshToken = await jwt.sign({ token: EncryptCryptoJS(model) }, config.JWT_SECRET_REFRESH);
            //decode วันหมดอายุ
            const expires_in = jwt.decode(token);

            refreshTokens.push(refreshToken)
            await updateSysmUsersService({
                id: __user.id,
                last_login: new Date(),
                update_by: __user.id,
            })
            result(res, {
                access_token: token,
                refresh_token: refreshToken,
                expires_in: expires_in.exp
            })
        }

    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.refreshTokenControllers = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) res.sendStatus(401)

        const token = authHeader && authHeader.split(" ")[1];
        if (config.NODE_ENV == "production") if (!refreshTokens.includes(token)) res.sendStatus(403)

        jwt.verify(token, config.JWT_SECRET_REFRESH, async (err, __res) => {
            if (err) res.sendStatus(403)
            const _res = DecryptCryptoJS(__res.token)
            const _model = {
                sysm_id: _res.id,
                roles_id: _res.roles_id,
                code_ldap: _res.code_ldap,
                roles_name: _res.roles_name,
                note: _res.note,
                user_name: _res.user_name,
                e_mail: _res.e_mail,
                note: _res.note,
                first_name: _res.first_name,
                last_name: _res.last_name,
                initials: _res.initials,
                company: _res.company,
                department: _res.department,
                job_title: _res.job_title,
                office: _res.office,
                web_page: _res.web_page,
                phone: _res.phone,
                address: _res.address,
                description: _res.description
            }
            const token = await generateAccessToken(_model)
            result(res, token)
        })
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

const generateAccessToken = async (model) => {
    const _encode = EncryptCryptoJS(model)
    return await jwt.sign({ token: _encode }, config.JWT_SECRET, { expiresIn: config.EXPIRES_IN });
}
