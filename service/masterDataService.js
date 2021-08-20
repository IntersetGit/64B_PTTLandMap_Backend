const models = require("../models/")


//-------------- เพิ่ม ลบ แก้ไข mas_layer_group-------//
exports.createMasLayersService = async (data) => {
  const id = uuid.v4()
  const createMasLayers = await models.mas_layer_groups.create({
    id,
    group_name:data.group_name,
    order_by:order_by,
    url:data.url,
    isuse:1,
  })
  return createMasLayers
};


exports.deleteMasLayersService = async (data) => {
  const deleteMasLayers = await models.mas_layer_groups.destroy({where:{id:data.id}})
    return deleteMasLayers;
};


exports.updateMasLayersService = async (data) => {
  const id = uuid.v4()
  const updateMasLayers = await models.mas_layer_groups.update({
    id,
    group_name:data.group_name,
    order_by:data.order_by,
    isuse:1,
  },{
    where :{id:data.id}
  })
  return updateMasLayers
};

//---------------------------------------------------------------------------------//


//----เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-----//
exports.createDatLayersService = async (data) => {
  const createDatLayers = await models.dat_layers.create({
    group_layer_id:data.group_layer_id,
    layer_name:data.layer_name,
    wms:data.wms,
    url:data.url,
    created_by:data.user_id,
    created_date:new Date(),
  })
  return createDatLayers
};

exports.updateDatLayersService = async (data) => {
  const updateDatLayers = await models.dat_layers.update({
    layer_name:data.layer_name,
    wms:data.wms,
    url:data.url,
    update_by:data.user_id,
    update_date:new Date()
  },{
    where:{id:data.id}
  })
  return updateDatLayers;
};

exports.deleteDatLayersService = async (data) => {
  const deleteDataLayers = await models.dat_layers.destroy({where:{id:data.id}})
    return deleteDataLayers;
};
//-------------------------------------------//