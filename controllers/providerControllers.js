const sequelize = require("../config/dbConfig"); //connect db  query string
const messages = require('../messages/index');
const config = require('../config');
const jwt = require('jsonwebtoken');
const result = require('../middleware/result');
const { ldap } = require("../service/ldapService");
const { updateSysmUsersService, filterUsernameSysmUsersService, getUserService } = require("../service/sysmUsersService");
const { EncryptCryptoJS, DecryptCryptoJS, checkPassword, sequelizeString } = require('../util');
const ActiveDirectory = require('activedirectory');

const refreshTokens = []

/* เข้าสู่ระบบ */
exports.loginControllers = async (req, res, next) => {
    try {
        let { username, password, token } = req.body;

        if (token) {
            const _decrypt = DecryptCryptoJS(token)
            username = _decrypt.username
            password = _decrypt.password
        }
        
        const _res = (username.toUpperCase()) !== ('superadmin'.toUpperCase()) && (username.toUpperCase()) !== ('editor'.toUpperCase()) && (username.toUpperCase()) !== ('viewer'.toUpperCase()) ? await ldap({ user_name: username, password }) :  await filterUsernameSysmUsersService(username)
        if (!_res) {
            const error = new Error("ไม่มีผู้ใช้ในระบบฐานข้อมูล");
            error.statusCode = 500;
            throw error; 
        }
        if( username ==  "superadmin" || username == "editor" || username == "viewer" ) {
            const passwordecrypt = await checkPassword(password, _res.password); //เช็ค password ตรงไหม
            console.log(passwordecrypt);
            if (!passwordecrypt) {
                const error = new Error("รหัสผ่านไม่ถูกต้อง !");
                error.statusCode = 500;
                throw error;
            }
        }
        
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

exports.loginAD = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        /* เพิ่ม user */
        // const config_ad = {
        //     url: `ldap://ptt.corp`,
        //     baseDN: `DC=ptt,DC=corp`,
        //     username: `580054@ptt.corp`,
        //     password: "200192xA"
        // }

        const config_ad = {
            url: `ldap://ptt.corp`,
            baseDN: `DC=ptt,DC=corp`,
            username: `${username}@ptt.corp`,
            password
        }

        const ad = new ActiveDirectory(config_ad);

        ad.findUser(username, (err, user) => {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                result(res, JSON.stringify(err), 400)
                return;
            }

            if (!user) result(res, "error", 400)
            else result(res, user)
        });


        // result(res, ad)

    } catch (error) {
        next(error);
    }
}

exports.refreshTokenControllers = async (req, res, next) => {
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
        next(error);
    }
};

const generateAccessToken = async (model) => {
    const _encode = EncryptCryptoJS(model)
    return await jwt.sign({ token: _encode }, config.JWT_SECRET, { expiresIn: config.EXPIRES_IN });
}


//---------- ค้นหาผู้ใช้งาน -------------------------ลูกหมี// 
exports.getSearchUserController = async (req, res) => {
    const { search } = req.body;
    let sql = `
        select Suser.id,Suser.user_name,Suser.e_mail,roles.roles_name,Puser.first_name||' '||Puser.last_name firstLast from system.sysm_users Suser
        inner join ptt_data.dat_profile_users Puser on Suser.id=Puser.user_id
        inner join system.sysm_roles roles on roles.id=Suser.roles_id`

    if (search) {
        sql += ` WHERE Suser.user_name ILIKE '%${search}%'
            or Suser.e_mail ILIKE '%${search}%' 
            or Puser.first_name  ILIKE '%${search}%' 
            or Puser.last_name ILIKE '%${search}%' 
            or roles.roles_name ILIKE '%${search}%'`
    }
    res.send(await sequelizeString(sql))

}




