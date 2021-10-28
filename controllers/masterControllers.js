const { sequelizeString } = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { createDatLayersService, updateDatLayersService, deleteDatLayersService, createMasLayersService, updateMasLayersService, deleteMasLayersService, getAllTitleNameService, getMasLayersService, getDatLayersService, getMasProviceService, getMasSubdistrictService, getMasDistrictService, getAllMasterLayers, getSysmRoleService, editMasLayersShapeService, _getdatefromWms } = require("../service/masterDataService")
const { viewGetNameTitleService } = require('../service/views_database/view_name_title')
const models = require("../models/index");
const { checkImgById } = require('../util')
const { sequelize } = require("../models/index");
const { getAllMasLayersShapeService } = require("../service/masterDataService");
const { createMasLayersShapeService } = require('../service/masterDataService')
const { deleteMasLayersShapeService } = require('../service/masterDataService')
const { getAllMasStatusProjectService } = require('../service/masterDataService')
const { createMasStatusProjectService } = require ('../service/masterDataService')
const { editMasStatusProjectService } = require ('../service/masterDataService')
const { deleteMasStatusProjectService } = require ('../service/masterDataService')
const { getByIdMasStatusProjectService } = require ('../service/masterDataService')
const { getByIdMasLayersShapeService } = require ('../service/masterDataService')

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
exports.getProvince = async (req, res, next) => {
  result(res, await getMasProviceService())
}
exports.getDistrict = async (req, res, next) => {
  result(res, await getMasDistrictService())
}
exports.getSubDistrict = async (req, res, next) => {
  result(res, await getMasSubdistrictService())
}
//------------------------------------------------------------------//

//---------------- แสดง เพิ่ม ลบ แก้ไข mas_layers_group -------------- //
exports.getMasLayersName = async (req, res, next) => {
  try {
    const { search } = await req.body
    const _res = await getAllMasterLayers(search)

    _res.forEach(val => {
      val.symbol = checkImgById(val.id, "symbol_group") ?? null
    });

    result(res, _res)
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
    const data = req.query
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถลบข้อมูลได้")
    result(res, await deleteMasLayersService(data))
  } catch (error) {
    next(error)
  }
}
//------------------------------------------------------------//


//----------- แสดง เพิ่่ม ลบ แก้ไข dat_layers  ---------//
exports.getDataLayers = async (req, res, next) => {
  try {
    const { search } = req.query
    result(res, await getDatLayersService(search))
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

//----------- ดึงข้อมูล systems_roles หน้าเพิ่มผู้ใช้ระบบ -----//
exports.getSysmRoleController = async (req, res, next) => {
  try {
    result(res, await getSysmRoleService());
  } catch (error) {
    next(error);
  }
};

//------------- แสดงตารางข้อมูล GIS Layer หน้าจัดการข้อมูล GIS Layer ------------//
exports.getAllMasLayersShape = async (req, res, next) => {
  try {
    const { search } = req.query
    result(res, await getAllMasLayersShapeService(search))
  } catch (error) {
    next(error);
  }
}
exports.getByIdMasLayersShape = async (req, res, next) => {
  try {
    const {id} = req.params
    result(res, await getByIdMasLayersShapeService(id))
  } catch (error) {
    next(error)
  }
}

//------------- เพิ่ม ลบ แก้ไข GIS Layer หน้าจัดการข้อมูล GIS Layer ------------//
exports.createAndEditMasLayersShape = async (req, res, next) => {
  try {
    const data = req.body
    if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2' || 'cec6617f-b593-4ebc-9604-3059dfee0ac4') throw new Error("คุณไม่ใช่ Administrator และ Editor ไม่สามารถเพิ่มข้อมูลได้")

    if (data.id) {
      result(res, await editMasLayersShapeService(data))
    } else {
      result(res, await createMasLayersShapeService(data))
    }
  } catch (error) {
    next(error)
  }
}

exports.deleteMasLayersShape = async (req, res, next) => {
  try {
    const data = req.query
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2' || 'cec6617f-b593-4ebc-9604-3059dfee0ac4') throw new Error("คุณไม่ใช่ Administratorc และ Editor ไม่สามารถลบข้อมูลได้")
    result(res, await deleteMasLayersShapeService(data))
  } catch (error) {
    next(error)
  }
}

//------------ แสดงตารางข้อมูล Status Project หน้า Status โครงการ ------------//
exports.getAllMasStatusProject = async (req, res, next) => {
  try{
    const { search, order = 'status_code', sort = 'ASC'} = req.query
    result (res, await getAllMasStatusProjectService(search, order, sort))
  } catch (error) {
    next(error)
  }
}

exports.getByIdMasStatusProject = async (req, res, next) => {
  try {
    const {id} = req.params
    result(res, await getByIdMasStatusProjectService(id))
  } catch (error) {
    next(error)
  }
}

//------------ เพิ่ม ลบ แก้ไข Status Project หน้า Status โครงการ------------//
exports.createAndEditMasStatusProject = async(req, res, next) => {
  try {
    const data = req.body
    if (req.user.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถเพิ่มข้อมูลได้")

    if (data.id) {
      result(res, await editMasStatusProjectService(data))
    } else {
      result(res, await createMasStatusProjectService(data))
    }
  } catch (error) {
    next(error)
  }
}

exports.deleteMasStatusProject = async (req, res, next) => {
  try {
    const data = req.query
    const users = req.user
    if (users.roles_id != '8a97ac7b-01dc-4e06-81c2-8422dffa0ca2') throw new Error("คุณไม่ใช่ Administrator ไม่สามารถลบข้อมูลได้")
    result(res, await deleteMasStatusProjectService(data))
  } catch (error) {
    next(error)
  }
}

//----------- ค้นหาโดย startdate, enddate time silder--------------------------//
exports.getByDateFromWms = async (req, res, next) => {
    try {
        const { startdate, enddate } = req.query;
        result(res, await _getdatefromWms(startdate, enddate));

    } catch (error) {
        next(error);
    }
}