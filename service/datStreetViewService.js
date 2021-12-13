const uuid = require('uuid')
const models = require('../models')
const { sequelizeString, sequelizeStringFindOne, sequelizeStringLike } = require('../util/index')

//---------------- แสดง เพิ่ม ลบ แก้ไข dat street view ------------------//
exports.getAllDatStreetViewService = async (search) => {
    let sql = ` SELECT * FROM ptt_data.dat_street_view `

    if (search) sql += ` WHERE name ILIKE :search_name `

    return await sequelizeStringLike(sql, {search})
}

exports.createDatStreetViewService = async (data, users) => {
    const id = uuid.v4()
    const createDatStreetView = await models.dat_street_view.create({
        id,
        coordinate: data.coordinate,
        name: data.name,
        url: data.url,
        created_date: new Date(),
        created_by: users
    })
    return createDatStreetView
}

exports.editDatStreetViewService = async (data, users) => {
    const editDatStreetView = await models.dat_street_view.findOne({
        where: { id: data.id }
    })
    if (!editDatStreetView) {
        const error = new Error('ไม่พบข้อมูล');
        error.statusCode = 404;
        throw error
    }

    await models.dat_street_view.update({
        id: data.id,
        coordinate: data.coordinate,
        name: data.name,
        url: data.url,
        updated_by: users,
        updated_date: new Date()
    }, {
        where: { id: data.id }
    })
    return data.id
}

exports.deleteDatStreetViewService = async (data, users) => {
    await models.dat_street_view.destroy({
        where: { id: data.id }
    })
    return true
}
