const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { createDatLayersService, updateDatLayersService, deleteDatLayersService, createMasLayersService, updateMasLayersService, deleteMasLayersService, getAllTitleNameService } = require("../service/masterDataService")
const { viewGetNameTitleService } = require('../service/views_database/view_name_title')

exports.getNameTitle = async (req, res, next) => {
  try {
    result(res, await getAllTitleNameService());
  } catch (error) {
    next(error);
  }
}

exports.viewGetNameTitle = async (req, res, next) => {
  try {
    const { id } = req.query
    result(res, await viewGetNameTitleService(id))
  } catch (error) {
    next(error);
  }
}


//---------------- เพิ่ม ลบ แก้ไข mas_layers_group -------------- //
exports.getMasLayers = async (req,res,next)=>{
  try {
    const data= req.body
    const user = req.user

    result(res,"get")
  } catch (error) {
    next(error)
  }
}

exports.createMasLayers = async (req, res, next) => {
  try {
    const data = req.body
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")
    result(res, await createMasLayersService(data, users))
  } catch (error) {
    next(error)
  }
}

exports.updateMasLayers = async (req, res, next) => {
  try {
    const data = req.body
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถแก้ข้อมูลได้")
    result(res, await updateMasLayersService(data, users))
  } catch (error) {
    next(error)
  }
}

exports.deleteMasLayers = async (req, res, next) => {
  try {
    const data = req.body
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถลบข้อมูลได้")
    result(res, await deleteMasLayersService(data))
  } catch (error) {
    next(error)
  }
}
//------------------------------------------------------------//


//----เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-----//
exports.getDataLayers = async (req,res,next)=>{
  try {
    const data= req.body
    const user = req.user
    result(res,"get")
  } catch (error) {
    next(error)
  }
}
exports.createDataLayers = async (req, res, next) => {
  try {
    const data = req.body
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")
    result(res, await createDatLayersService(data, users))
  } catch (error) {
    next(error)
  }
}

exports.updateDataLayers = async (req, res, next) => {
  try {
    const data = req.body
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถแก้ไขข้อมูลได้")
    result(res, await updateDatLayersService(data, users))
  } catch (error) {
    next(error)
  }
}

exports.deleteDataLayers = async (req, res, next) => {
  try {
    const data = req.body
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถลบข้อมูลได้")
    result(res, await deleteDatLayersService(data))
  } catch (error) {
    next(error)
  }
}
//-------------------------------------------//