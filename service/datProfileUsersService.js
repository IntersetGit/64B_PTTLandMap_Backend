const models = require('../models/index')
const { sequelizeStringFindOne } = require('../util')
const uuidv4 = require("uuid");

/* เพิ่ม ตารางข้อมูลส่วนตัวผู้ใช้งานระบบ */
exports.createDatProfileUsersService = async (model, transaction) => {
    const id = model.id ?? uuidv4.v4();
    const _model = {
        id,
        user_id: model.user_id,
        created_by: model.created_by,
        created_date: new Date(),
    }
    if (model.first_name) _model.first_name = model.first_name
    if (model.last_name) _model.last_name = model.last_name
    if (model.initials) _model.initials = model.initials
    if (model.e_mail) _model.e_mail = model.e_mail
    if (model.company) _model.company = model.company
    if (model.department) _model.department = model.department
    if (model.job_title) _model.job_title = model.job_title
    if (model.office) _model.office = model.office
    if (model.web_page) _model.web_page = model.web_page
    if (model.phone) _model.phone = model.phone
    if (model.address) _model.address = model.address
    if (model.description) _model.description = model.description

    await models.dat_profile_users.create(_model, { transaction });
    return id
}

/* แก้ไข ตารางข้อมูลส่วนตัวผู้ใช้งานระบบ */
exports.updateDatProfileUsersService = async (model, transaction) => {
    const _model = {
        update_date: new Date(),
    }
    if (model.user_id) _model.user_id = model.user_id
    if (model.first_name) _model.first_name = model.first_name
    if (model.last_name) _model.last_name = model.last_name
    if (model.initials) _model.initials = model.initials
    if (model.e_mail) _model.e_mail = model.e_mail
    if (model.company) _model.company = model.company
    if (model.department) _model.department = model.department
    if (model.job_title) _model.job_title = model.job_title
    if (model.office) _model.office = model.office
    if (model.web_page) _model.web_page = model.web_page
    if (model.phone) _model.phone = model.phone
    if (model.address) _model.address = model.address
    if (model.description) _model.description = model.description
    if (model.update_by) _model.update_by = model.update_by

    await models.dat_profile_users.update(_model, { where: { user_id: model.user_id }, transaction });
    return model.user_id;
}
