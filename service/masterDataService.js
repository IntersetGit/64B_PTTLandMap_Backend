const uuid = require("uuid")
const { deleteDataLayers } = require("../controllers/masterControllers")
const models = require("../models/")
const { sequelizeString, sequelizeStringFindOne } = require("../util/index")


exports.getAllTitleNameService = async () => {
  return models.mas_name_titles.findAll()
}

exports.getAllMasterLayers = async (search) => {
  let sql = ` select * from master_lookup.mas_layer_groups where isuse =1 `

  if (search) sql += ` and group_name ILIKE '%${search}%' `

  return sequelizeString(sql)
}
//----------------------- แสดง จังหวัด อำเภอ ตำบล ----------------------//
exports.getMasProviceService = async () => {
  return await models.mas_province.findAll()
}
exports.getMasDistrictService = async () => {
  return await models.mas_district.findAll()
}
exports.getMasSubdistrictService = async () => {
  return await models.mas_subdistrict.findAll()
}
//--------------------------------------------------------------------//

//---------------- แสดง เพิ่ม ลบ แก้ไข mas_layer_group ------------------//
exports.getMasLayersService = async () => {
  const masLayersGroup = await models.mas_layer_groups.findAll()
  return masLayersGroup
}


exports.createMasLayersService = async (data, users) => {
  const result = await sequelizeStringFindOne(` SELECT MAX(order_by) +1 AS count FROM master_lookup.mas_layer_groups `)
  const createMasLayers = await models.mas_layer_groups.create({
    group_name: data.group_name,
    order_by: result.count,
    isuse: data.isuse ?? 1,
    created_by: users.sysm_id,
    created_date: new Date()
  })


  return createMasLayers
};

exports.updateMasLayersService = async (data, users) => {
  const _data = {
    update_by: data.update_by,
    updata_data: new Date()
  }

  if (data.group_name) _data.group_name = data.group_name
  if (data.order_by) _data.order_by = data.order_by
  if (data.isuse) _data.isuse = data.isuse

  const updateMasLayers = await models.mas_layer_groups.update(_data, { where: { id: data.id } })
  return updateMasLayers[0]
};

exports.deleteMasLayersService = async (data) => {
  const deleteMasLayers = await models.mas_layer_groups.destroy({ where: { id: data.id } })
  return deleteMasLayers;
};
//---------------------------------------------------------------------------------//


//----------------- แสดง เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย) ------------------------//
exports.getDatLayersService = async (search) => {

  let sql = `
  SELECT * FROM ptt_data.dat_layers WHERE id is not null `

  if (search) sql += ` AND layer_name ILIKE '%${search}%'`

  return await sequelizeString(sql)

  // const getDatLayers = await models.dat_layers.findAll()
  // return getDatLayers
}



exports.createDatLayersService = async (data, users) => {
  const createDatLayers = await models.dat_layers.create({
    group_layer_id: data.group_layer_id,
    layer_name: data.layer_name,
    wms: data.wms,
    url: data.url,
    wms_url: data.wms_url,
    type_server: data.type_server,
    isuse: data.isuse ?? 1,
    created_by: users.sysm_id,
    created_date: new Date(),
  })
  return createDatLayers
};

exports.updateDatLayersService = async (data, users) => {
  const _data = {
    isuse: 1,
    update_by: users.user_id,
    update_date: new Date()
  }

  if (data.layer_name) _data.layer_name = data.layer_name
  if (data.wms) _data.wms = data.wms
  if (data.url) _data.url = data.url
  if (data.wms_url) _data.wms_url = data.wms_url
  if (data.type_server) _data.type_server = data.type_server

  const updateDatLayers = await models.dat_layers.update(_data, { where: { id: data.id } })
  return updateDatLayers[0];
};

exports.deleteDatLayersService = async (data) => {
  const deleteDataLayers = await models.dat_layers.destroy({ where: { id: data.id } })
  return deleteDataLayers;
};
//----------------------------------------------------------------------------------//


//----------- ดึงข้อมูล systems_roles หน้าเพิ่มผู้ใช้ระบบ -----//
exports.getSysmRoleService = async () => {
  const userrole = await models.sysm_roles.findAll()
  return userrole

}

//------------- ตารางข้อมูล GIS Layer หน้าจัดการข้อมูล GIS Layer ------------//
exports.getAllMasLayersShapeService = async () => {
  const allMasLayersShape = await models.mas_layers_shape.findAll()
  return allMasLayersShape;
}

//------------- เพิ่ม แก้ไข ลบ GIS Layer หน้าจัดการข้อมูล GIS Layer ------------//
exports.createMasLayersShapeService = async (data, user) => {
  const id = uuid.v4()
  await models.mas_layers_shape.create({
    id,
    name_layer: data.name_layer,
    table_name: data.table_name,
    color_layer: data.color_layer,
    type: data.type,
    group_layer_id: data.group_layer_id
  })
  return id
}

exports.editMasLayersShapeService = async (data, user) => {
  const editMasLayersShape = await models.mas_layers_shape.findOne({
    where: { id: data.id }
  })
  if (!editMasLayersShape) {
    const error = new Error('ไม่พบข้อมูล');
    error.statusCode = 404;
    throw error;
  }
  await models.mas_layers_shape.update({
    name_layer: data.name_layer,
    table_name: data.table_name,
    color_layer: data.color_layer,
    type: data.type,
    group_layer_id: data.group_layer_id
  }, {
    where: { id: data.id }
  })
  return data.id
}

exports.deleteMasLayersShapeService = async (data, user) => {
  await models.mas_layers_shape.destroy({
    where:{id:data.id}
  })
  return true
}