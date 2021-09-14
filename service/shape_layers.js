const models = require('../models');
const { sequelizeString } = require('../util');
const uuid = require('uuid');

exports.addShapeLayers = async (model, transaction) => {
    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer,
        table_name: model.table_name,
        type: model.type
    }

    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer

    await models.shape_layers.create(_model, { transaction })
    return id
}


exports.getDataShapService = async () => {
    let sql = `
    SELECT sl.id
	,sl.name_layer
	,sl.table_name
	,sl.color_layer
	,sl.type
	,sl.group_layer_id
	,mlg.group_name
	
	FROM shape_data.shape_layers sl
	INNER JOIN master_lookup.mas_layer_groups mlg ON sl.group_layer_id = mlg.id
	WHERE mlg.isuse = 1
    `
    return sequelizeString(sql)
}