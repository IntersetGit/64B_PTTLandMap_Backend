const ActiveDirectory = require("activedirectory");
const config = require("../config");
const { filterUsernameSysmUsersService, updateSysmUsersService, updateConfigAdService, createConfigAdService } = require("../service/sysmUsersService");
const { createSysmUsersService } = require("../service/sysmUsersService");
const { createDatProfileUsersService } = require("../service/datProfileUsersService");
const sequelize = require("../config/dbConfig"); //connect db  query string
const uuidv4 = require("uuid");
const result = require("../middleware/result");
const { DecryptCryptoJS } = require("../util");
const models = require("../models/index");
const { getSysmRoleService } = require("../service/masterDataService");

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
    const { username, password, token, roles_id } = req.body;
    const _res = await connectPttAD_(username);
    // console.log(_res);

    if (token) {
      const _decrypt = DecryptCryptoJS(token);
      username = _decrypt.username;
      password = _decrypt.password;
    }

    if (!_res) {
      const err = new Error("ไม่พบชื่อผู้ใช้ ad");
      err.statsCode = 404;
      throw err;
    }

    const __res = await filterUsernameSysmUsersService(username);
    const id = uuidv4.v4();
    if (!__res) {
      await createSysmUsersService(
        {
          id,
          roles_id,
          user_name: username,
          password,
          e_mail: _res.mail,
          created_by: id,
        },
        transaction
      );

      await createDatProfileUsersService(
        {
          user_id: id,
          created_by: id,
          first_name: _res.givenName,
          last_name: _res.sn,
          initials: _res.initials,
          e_mail: _res.mail,
        },
        transaction
      );
    } else {
      const err = new Error(`มีผู้ใช้ ${username} ในฐานข้อมูล`);
      err.statusCode = 400;
      throw err;
    }

    await transaction.commit();
    result(res, id);
  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};

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

    if (!username) {
      const err = new Error('กรอกข้อมูล username')
      err.statusCode = 400
      throw err
    }
    const _res = await connectPttAD_(username)
    const _model = {
      employeeID: _res.employeeID,
      displayName: _res.displayName,
      isUsers: true
    }

    result(res, _model)

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

/* funcion connect ADPTT */
const connectPttAD_ = async (username) => {
  const myPromise = new Promise((resolve, reject) => {
    const { url, search } = connect[config.NODE_ENV];

    const config_ad = {
      url,
      baseDN: `${search}`,
      username: `${config.USER_NAME_AD}@ptt.corp`,
      password: config.PASSWORD_AD,
    };

    const ad = new ActiveDirectory(config_ad);
    ad.findUser(username, (err, user) => {
      if (err) {
        const _err = { message: "การเชื่อมต่อผิดพลาด" };
        resolve(_err);
      }
      if (!user) {
        console.log(user);
        const _err = new Error('ไม่พบชื่อผู้ใช้')
        _err.statusCode = 404
        reject(_err);
      }
      resolve(user);
    });
  });
  return await myPromise;
};