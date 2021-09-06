const {sequelizeString} = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { createDatLayersService, updateDatLayersService, deleteDatLayersService, createMasLayersService,updateMasLayersService, deleteMasLayersService, getAllTitleNameService,getMasLayersService,getDatLayersService,getMasProviceService,getMasSubdistrictService,getMasDistrictService } = require("../service/masterDataService")
const { viewGetNameTitleService } = require('../service/views_database/view_name_title')
const models = require("../models/index");
const { sequelize } = require("../models/index");

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

//------------------- แสดง จังหวัด อำเภอ ตำบล -------------------------//
exports.getProvince = async(req,res,next)=>{
  result(res,await getMasProviceService())
}
exports.getDistrict = async (req,res,next)=>{
  result(res,await getMasDistrictService())
}
exports.getSubDistrict = async (req,res,next)=>{
  result(res,await getMasSubdistrictService())
}
//------------------------------------------------------------------//

//---------------- แสดง เพิ่ม ลบ แก้ไข mas_layers_group -------------- //
exports.getMasLayersName = async (req,res,next)=>{
  try {
    const {search} = await req.body
    if(search){
      const sql = `
	    select * from master_lookup.mas_layer_groups where isuse =1 and group_name ILIKE'%${search}%'
      `
      return result(res,await sequelizeString(sql))
    }
    result(res, await getMasLayersService())
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
    result(res, await updateMasLayersService(data,users))
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


//----------- แสดง เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย) ---------//
exports.getDataLayersName = async (req,res,next)=>{
  try {
    const {layername} = req.query
    result(res,await models.dat_layers.findOne(
      {
      where:{layer_name:layername}
      }))
  } catch (error) {
    next(error)
  }
}


exports.getDataLayers = async (req,res,next)=>{
  try {
    const { search } = req.query
    result(res,await getDatLayersService(search))
  } catch (error) {
    next(error)
  }
}


exports.createDataLayers = async (req, res, next) => {
  try {
    const data = req.body
    if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")
    result(res, await createDatLayersService(data, req.user))
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
//---------------------------------------------------------//