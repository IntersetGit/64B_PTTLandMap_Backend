const sequelize = require("../config/dbConfig"); //connect db  query string
const messages = require('../messages/index');
const config = require('../config');
const jwt = require('jsonwebtoken');
const result = require('../middleware/result');
const { ldap } = require("../service/ldapService");
const { updateSysmUsersService, filterUsernameSysmUsersService, getUserService, getSearchUserService } = require("../service/sysmUsersService");
const { EncryptCryptoJS, DecryptCryptoJS, checkPassword, sequelizeString, encryptPassword } = require('../util');
const ActiveDirectory = require('activedirectory');


const refreshTokens = []



exports.updatePassWordUser = async (req, res, next) => {
    try {
        const { newPassword, currentPassword } = req.body;
        req.user.user_name
        const finddata = await filterUsernameSysmUsersService(req.user.user_name)
        const _res = await checkPassword(currentPassword, finddata.password)

        if (_res) {
            const changpassword = await encryptPassword(newPassword)
            await updateSysmUsersService({
                password: changpassword,
                id: req.user.sysm_id
            }
            )

        } else {
            const error = new Error("รหัสผ่านไม่ถูกต้อง !");
            error.statusCode = 400;
            throw error;
        }
        result(res, true)
    } catch (error) {
        next(error)
    }

}

/* เข้าสู่ระบบ */
exports.loginControllers = async (req, res, next) => {
    try {
        let { username, password, token } = req.body;

        if (token) {
            const _decrypt = DecryptCryptoJS(token)
            username = _decrypt.username
            password = _decrypt.password
        }
        let _res = await filterUsernameSysmUsersService(username);
        if (!_res) {
            const error = new Error("ไม่พบชื่อผู้ใช้ในระบบหรือรหัสผ่านผิด");
            error.statusCode = 400;
            throw error;
        }

        if (_res.is_ad) _res = await ldap({ user_name: username, password })
        if(!_res.password) _res.password = password
            const passwordecrypt = await checkPassword(password, _res.password); //เช็ค password ตรงไหม
            // console.log(passwordecrypt);
            if (!passwordecrypt) {
                const error = new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง !");
                error.statusCode = 400;
                throw error;
            }
        

        const model = {
            sysm_id: _res.id,
            roles_id: _res.roles_id,
            code_ldap: _res.code_ldap,
            roles_name: _res.roles_name,
            note: _res.note,
            user_name: _res.user_name,
            e_mail: _res.email,
            note: _res.note,
            first_name: _res.first_name,
            last_name: _res.last_name,
            initials: _res.initials,
            is_ad: _res.is_ad
            // company: _res.company,
            // department: _res.department,
            // job_title: _res.job_title,
            // office: _res.office,
            // web_page: _res.web_page,
            // phone: _res.phone,
            // address: _res.address,
            // description: _res.description
        }

        //สร้าง token
        const _token = await generateAccessToken(model)
        const refreshToken = await jwt.sign({ token: EncryptCryptoJS(model) }, config.JWT_SECRET_REFRESH);
        //decode วันหมดอายุ
        const expires_in = jwt.decode(_token);

        refreshTokens.push(refreshToken)
        await updateSysmUsersService({
            id: _res.id,
            last_login: new Date(),
            update_by: _res.id,
        })
        result(res, {
            access_token: _token,
            refresh_token: refreshToken,
            expires_in: expires_in.exp
        })

    } catch (error) {
        next(error);
    }
};

exports.refreshTokenControllers = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) res.sendStatus(401)

        const token = authHeader && authHeader.split(" ")[1];
        // if (config.NODE_ENV == "production") if (!refreshTokens.includes(token)) res.sendStatus(403)

        jwt.verify(token, config.JWT_SECRET_REFRESH, async (err, __res) => {
            if (err) res.sendStatus(403)
            const _res = DecryptCryptoJS(__res.token)
            const _model = {
                sysm_id: _res.sysm_id,
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
        next(error);
    }
};

const generateAccessToken = async (model) => {
    const _encode = EncryptCryptoJS(model)
    return await jwt.sign({ token: _encode }, config.JWT_SECRET, { expiresIn: config.EXPIRES_IN });
}


//---------- ค้นหาผู้ใช้งาน -------------------------// 
exports.getSearchUserController = async (req, res, next) => {
    try {
        const { search } = req.body;
        result(res, await getSearchUserService(search));
    } catch (error) {
        next(error);
    }


}




