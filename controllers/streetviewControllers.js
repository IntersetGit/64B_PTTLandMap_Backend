const { sequelizeString } = require('../util/index')
const models = require('../models')
const messages = require('../messages/index')
const result = require('../middleware/result')
const { sequelize } = require('../models/index')
const { getAllDatStreetViewService, createDatStreetViewService, editDatStreetViewService, deleteDatStreetViewService } = require('../service/datStreetViewService')

//---------------- แสดง เพิ่ม ลบ แก้ไข dat street view ------------------//
exports.getAllDatStreetView = async (req, res, next) => {
    try {
        const { search } = req.query
        result(res, await getAllDatStreetViewService(search))
    } catch (error) {
        next(error)
    }
}

exports.createDatStreetView = async (req, res, next) => {
    try {
        const data = req.body
        if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")

        
        if (data.id) {
            result(res, await editDatStreetViewService(data, req.user.sysm_id))
        }
        else {
            result(res, await createDatStreetViewService(data, req.user.sysm_id))
        }
    } catch (error) {
        next(error)
    }
}

exports.deleteDatStreetView = async (req, res, next) => {
    try {
        const data = req.query
        if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถลบข้อมูลได้")
        result(res, await deleteDatStreetViewService(data))
    } catch (error) {
        next(error)
    }
}
