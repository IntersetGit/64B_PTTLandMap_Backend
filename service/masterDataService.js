const models = require("../models/")


exports.getAllTitleNameService = async() => {
  return models.mas_name_titles.findAll()
}
//-------------- เพิ่ม ลบ แก้ไข mas_layer_group-------//
exports.createMasLayersService = async (data) => {
  const createMasLayers = await models.mas_layer_groups.create({
    group_name:data.group_name,
    order_by:data.order_by,
    isuse:data.isuse ?? 1,
    created_by:data.user_id,
    created_date:new Date()
  })
  
  return createMasLayers
};

exports.updateMasLayersService = async (data) => {
  const _data = {
    update_by: data.update_by,
    updata_data:new Date()
  }

  if (data.group_name) _data.group_name = data.group_name
  if (data.order_by) _data.order_by = data.order_by
  if (data.isuse) _data.isuse = data.isuse

  const updateMasLayers = await models.mas_layer_groups.update(_data, { where :{id:data.id} })
  return updateMasLayers[0]
};

exports.deleteMasLayersService = async (data) => {
  const deleteMasLayers = await models.mas_layer_groups.destroy({where:{id:data.id}})
    return deleteMasLayers;
};
//---------------------------------------------------------------------------------//


//----เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-----//
exports.createDatLayersService = async (data) => {
  const createDatLayers = await models.dat_layers.create({
    group_layer_id:data.group_layer_id,
    layer_name:data.layer_name,
    wms:data.wms,
    url:data.url,
    wms_url:data.wms_url,
    type_server:data.type_server,
    created_by:data.user_id,
    created_date:new Date(),
  })
  return createDatLayers
};

exports.updateDatLayersService = async (data) => {
  const _data = {
    update_by:data.user_id,
    update_date:new Date()
  }

  if (data.layer_name) _data.layer_name = data.layer_name
  if (data.wms) _data.wms = data.wms
  if (data.url) _data.url = data.url
  if (data.wms_url) _data.wms_url = data.wms_url
  if (data.type_server) _data.type_server = data.type_server

  const updateDatLayers = await models.dat_layers.update(_data ,{ where:{id:data.id} })
  return updateDatLayers[0];
};

exports.deleteDatLayersService = async (data) => {
  const deleteDataLayers = await models.dat_layers.destroy({where:{id:data.id}})
    return deleteDataLayers;
};
//-------------------------------------------//