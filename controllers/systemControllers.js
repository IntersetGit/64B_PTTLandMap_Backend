const ActiveDirectory = require("activedirectory");
const config = require("../config");
const { filterUsernameSysmUsersService, updateSysmUsersService, updateConfigAdService, createConfigAdService } = require("../service/sysmUsersService");
const { createSysmUsersService } = require("../service/sysmUsersService");
const { createDatProfileUsersService, updateDatProfileUsersService } = require("../service/datProfileUsersService");
const sequelize = require("../config/dbConfig"); //connect db  query string
const uuidv4 = require("uuid");
const result = require("../middleware/result");
const { DecryptCryptoJS, encryptPassword, EncryptCryptoJS } = require("../util");
const models = require("../models/index");
const { getSysmRoleService } = require("../service/masterDataService");
const { connectPttAD } = require("../service/ldapService");

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
};

/* สร้าง AD */
exports.createUserAD = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let { username, password, token, roles_id, first_name, last_name, e_mail, is_ad } = req.body;
    const { user_name } = req.user
    const id = uuidv4.v4();

    if (token) {
      const _decrypt = DecryptCryptoJS(token);
      username = _decrypt.username;
      password = _decrypt.password;
    }

    if (is_ad) {
      const searchname = await filterUsernameSysmUsersService(user_name);
      const setUser = await filterUsernameSysmUsersService(username);
      if (setUser) {
        const err = new Error(`มีผู้ใช้ ${username} ในฐานข้อมูล`);
        err.statusCode = 400;
        throw err;
      }
      const __res = await connectPttAD({username , password: await DecryptCryptoJS(searchname.password), usernameDB: user_name, isDB: true });
      if (__res) {
        await createSysmUsersService({
          id,
          roles_id,
          user_name: username,
          password: await EncryptCryptoJS(password),
          e_mail: __res.mail,
          created_by: id,
          is_ad: true
        }, transaction);
        await createDatProfileUsersService({
          user_id: id,
          created_by: id,
          first_name: __res.givenName,
          last_name: __res.sn,
          initials: __res.initials,
          e_mail: __res.mail,
        }, transaction);
      }
    } else {
      const _res = await filterUsernameSysmUsersService(username);
      if (!_res) {
        await createSysmUsersService({
          id,
          roles_id,
          user_name: username,
          password: await EncryptCryptoJS(password),
          e_mail,
          created_by: id,
          is_ad: false
        }, transaction);

        await createDatProfileUsersService({
          user_id: id,
          created_by: id,
          first_name,
          last_name,
          e_mail
        }, transaction);
      } else {
        const err = new Error(`มีผู้ใช้ ${username} ในฐานข้อมูล`);
        err.statusCode = 400;
        throw err;
      }
    }

    await transaction.commit();
    result(res, id);
  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const model = req.body;

    const dataUser = {
      user_name: model.username,
      first_name: model.first_name,
      last_name: model.last_name,
      user_id: model.id,
      e_mail: model.e_mail
    }

    if (model.id) {
      await updateSysmUsersService(model, transaction)
      await updateDatProfileUsersService(dataUser, transaction);
    }

    await transaction.commit();
    result(res, model.id);

  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
}

//-------- update roles_id โดย id---------//
exports.updateRoleUser = async (req, res, next) => {
  try {
    const { id, roles_id } = req.body

    if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') {
      const err = new Error('คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้')
      err.statusCode = 403
      throw err
    }

    await updateSysmUsersService({ id, roles_id, update_by: req.user.sysm_id })

    result(res, id, 201)

  } catch (error) {
    next(error);
  }
};

/** เรียกสิทธิผู้ใช้งาน */
exports.getSysmRoleController = async (req, res, next) => {
  try {
    result(res, await getSysmRoleService());
  } catch (error) {
    next(error);
  }
};

/** ค้นหา AD  */
exports.findUserAd = async (req, res, next) => {
  try {
    const { username } = req.query
    const setUser = await filterUsernameSysmUsersService(req.user['user_name']);

    if (!username) {
      const err = new Error('กรอกข้อมูล username');
      err.statusCode = 400
      throw err
    }
    
    const _res = await connectPttAD({
      username: setUser['user_name'] == 'superadmin' || setUser['user_name'] == 'editor' ? config.USER_NAME_AD : username,
      password: setUser['user_name'] == 'superadmin' || setUser['user_name'] == 'editor' ? config.PASSWORD_AD : await DecryptCryptoJS(setUser['password']) ,
      usernameDB: setUser['user_name'] == 'superadmin' || setUser['user_name'] == 'editor' ? config.USER_NAME_AD : setUser['user_name'],
      isDB: true
    })
    const _model = {
      employeeID: _res.employeeID,
      displayName: _res.displayName,
      isUsers: true
    }
    result(res, _model);

  } catch (error) {
    next(error);
  }
}

exports.delUserAd = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') {
      const err = new Error('คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้')
      err.statusCode = 403
      throw err
    }

    await updateSysmUsersService({ id, isuse: 2 })

    result(res, true)

  } catch (error) {
    next(error);
  }
}

exports.updateConfigAd = async (req, res, next) => {
  try {
    const model = req.body;

    if (model.id) result(res, await updateConfigAdService(model));
    else result(res, await createConfigAdService(model));


  } catch (error) {
    next(error);
  }
}