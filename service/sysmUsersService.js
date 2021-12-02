const models = require('../models/index')
const { sequelizeStringFindOne } = require('../util')
const uuidv4 = require("uuid");

/* ค้นหา Username ตารางผู้ใช้งานระบบ ทั้งหมด */
exports.filterUsernameSysmUsersService = async (user_name) => {
    let sql = ` SELECT 
    a.id AS id,
    a.roles_id,
    a.code_ldap,
    c.roles_name,
    c.note AS roles_note,
    a.user_name,
    a.password,
    a.e_mail AS email,
    a.note,
    a.is_ad,
    b.first_name,
    b.last_name,
    b.initials,
    b.company,
    b.department,
    b.job_title,
    b.office,
    b.web_page,
    b.phone,
    b.address,
    b.description
    FROM system.sysm_users AS a
    INNER JOIN ptt_data.dat_profile_users AS b ON b.user_id = a.id 
    INNER JOIN system.sysm_roles AS c ON a.roles_id = c.id
    
    WHERE a.isuse = 1 AND UPPER(user_name)  = UPPER($1) `

    return await sequelizeStringFindOne(sql, [user_name])
}

/* เพิ่ม ตารางผู้ใช้งานระบบ */
exports.createSysmUsersService = async (model, transaction) => {
    const id = model.id ?? uuidv4.v4();
    const _model = {
        id,
        roles_id: model.roles_id,
        user_name: model.user_name,
        password: model.password,
        isuse: 1,
        created_date: new Date(),
    }
    if (model.e_mail) _model.e_mail = model.e_mail
    if (model.note) _model.note = model.note
    if (model.status_login) _model.status_login = model.status_login
    if (model.created_by) _model.created_by = model.created_by
    if (model.code_ldap) _model.code_ldap = model.code_ldap

    await models.sysm_users.create(_model, { transaction });
    return id
}

/* แก้ไข ตารางผู้ใช้งานระบบ */
exports.updateSysmUsersService = async (model) => {
    const _model = {
        update_date: new Date(),
    }
    if (model.roles_id) _model.roles_id = model.roles_id
    if (model.user_name) _model.user_name = model.user_name
    if (model.password) _model.password = model.password
    if (model.isuse) _model.isuse = model.isuse
    if (model.e_mail) _model.e_mail = model.e_mail
    if (model.note) _model.note = model.note
    if (model.status_login) _model.status_login = model.status_login
    if (model.update_by) _model.update_by = model.update_by
    if (model.last_login) _model.last_login = model.last_login

    await models.sysm_users.update(_model, { where: { id: model.id } });
    return model.id;
}

/* แก้ไข ตารางผู้ใช้งานระบบ */
exports.findCodeLdapSysmUsersService = async (code_ldap) => {
    return await models.sysm_users.findOne({ where: { code_ldap } });
}


exports.getUserService = async () => {
    const user = await models.sysm_users.findAll()
    return user
}


exports.createConfigAdService = async (model) => {
    await models.sysm_config.create({
        note: model.node,
        info_form: model.info
    })

    return true
}


exports.updateConfigAdService = async (model) => {

    await models.sysm_config.update({
        note: model.node,
        info_form: model.info
    }, { where: { id: model.id } })

    return model.id
}





