const models = require("../models/")
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