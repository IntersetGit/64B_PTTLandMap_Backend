const models = require('../models');
const { sequelizeString } = require('../util');


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