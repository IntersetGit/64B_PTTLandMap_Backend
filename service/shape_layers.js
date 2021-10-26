const models = require('../models');
const { sequelizeString } = require('../util');
const uuid = require('uuid');

exports.addShapeLayersService = async (model, transaction) => {
    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer ?? "test"
    }
    
    if (model.type) _model.type = model.type
    if (model.table_name) _model.table_name = model.table_name
    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer
    if (model.type_geo) _model.type_geo = "Polygon"
    else _model.type_geo = "Point"
    if (model.url) _model.url = model.url
    if (model.wms_name) _model.wms_name = model.wms_name
    if (model.type_server) _model.type_server = model.type_server
    if (model.date) _model.date = model.date
    if (model.option_layer) _model.option_layer = model.option_layer
    if (model.symbol_point) _model.symbol_point = model.symbol_point

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
						  ,'type',mls.type))
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





