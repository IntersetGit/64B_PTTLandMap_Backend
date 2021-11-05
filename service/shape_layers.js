const models = require('../models');
const { sequelizeString } = require('../util');
const uuid = require('uuid');

exports.addShapeLayersService = async (model, transaction) => {
    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer ?? "test"
    }

    if (model.type === "Point") _model.type = model.type = "shape file"
    else _model.type = model.type
    if (model.table_name) _model.table_name = model.table_name
    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer
    if (model.type_geo === "Polygon") _model.type_geo = model.type_geo
    else if (model.type_geo === "Point") _model.type_geo = model.type_geo
    else _model.type_geo = model.type_geo
    if (model.url) _model.url = model.url
    if (model.wms_name) _model.wms_name = model.wms_name
    if (model.type_server) _model.type_server = model.type_server
    if (model.date) _model.date = model.date
    if (model.option_layer) _model.option_layer = model.option_layer
    if (model.symbol_point) _model.symbol_point = model.symbol_point
    if (model.table_name_arr)  _model.table_name_arr = model.table_name_arr

    await models.mas_layers_shape.create(_model, { transaction })
    return id
}




exports.getDataShapService = async () => {
    let sql = `
    SELECT mlg.id
  ,mlg.group_name
  ,mlg.order_by
  ,mlg.isuse
  ,(SELECT json_agg(json_build_object('id',mls.id
						  ,'name_layer',mls.name_layer
						  ,'table_name',mls.table_name
						  ,'color_layer',mls.color_layer
						  ,'type',mls.type
							,'option_layer', mls.option_layer
							,'symbol_point', mls.symbol_point
							,'type_geo', mls.type_geo
							,'url', url
							,'wms_name', wms_name
							,'type_server', type_server
							,'option_layer', option_layer))
  FROM master_lookup.mas_layers_shape mls 
  WHERE mls.group_layer_id = mlg.id) AS children
	FROM master_lookup.mas_layer_groups mlg
	WHERE mlg.isuse = 1
	ORDER BY mlg.order_by
	
    `
    const _res = await sequelizeString(sql)

    return _res
}



exports.addkmlLayersService = async (model, transaction) => {
    console.log("model+++++++++++++++++++++++++++++++++++++++++++++++++e");
    console.log(model);


    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer ?? "test",
        table_name: model.table_name,
        type: model.type
    }

    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer

    await models.mas_layers_shape.create(_model, { transaction })
    return id
}


exports.getAlldataShapeKmlKmz = () => {

}





