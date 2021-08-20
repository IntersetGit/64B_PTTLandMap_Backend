const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { GetAllTitleNameService } = require("../service/mas_name_titles");
const { viewGetNameTitleService } = require('../service/views_database/view_name_title')

exports.getNameTitle = async (req, res, next) => {
  try {
    result(res, await GetAllTitleNameService());

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



//----เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-----//
exports.createDataLayers = async (req,res,next)=>{
  try {
    const data = req.body
    if(data.roles_id!='0678bba5-a371-417f-9734-aec46b9579ad') result(res,"คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")

    result(res,"create")
  } catch (error) {
    next(error)
  }
}

exports.updateDataLayers = async (req,res,next)=>{
  try {
    const data = req.body
    if(data.roles_id!='0678bba5-a371-417f-9734-aec46b9579ad') result(res,"คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")

    result(res,"update")
  } catch (error) {
    next(error)
  }
}

exports.deleteDataLayers = async (req,res,next)=>{
  try {
    const data = req.body
    if(data.roles_id!='0678bba5-a371-417f-9734-aec46b9579ad') result(res,"คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")
    result(res,"delete")
  } catch (error) {
    next(error)
  }
}
//-------------------------------------------//