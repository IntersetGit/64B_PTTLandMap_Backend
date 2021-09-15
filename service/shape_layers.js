const models = require('../models');
const { sequelizeString } = require('../util');
const uuid = require('uuid');

exports.addShapeLayers = async (model, transaction) => {
    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer ?? "ptt",
        table_name: model.table_name,
        type: model.type
    }

    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer

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
  ,(SELECT jsonb_build_object(
  'type',     'FeatureCollection',
  'features', jsonb_agg(features.feature)
  ) AS shape
  FROM (SELECT jsonb_build_object(
  'type',       'Feature',
  'id',         gid,
  'geometry',   ST_AsGeoJSON(geom)::jsonb,
  'properties', to_jsonb(inputs) - 'gid' - 'geom'
  ) AS feature
  FROM (SELECT * FROM shape_data."ptt geodata") inputs) features)

	FROM master_lookup.mas_layer_groups mlg
	WHERE mlg.isuse = 1
	ORDER BY mlg.order_by
	
    `
    // let sql = `
    // SELECT jsonb_build_object(
    //     'type',     'FeatureCollection',
    //     'features', jsonb_agg(features.feature)
    // ) AS shape
    // FROM (
    //   SELECT jsonb_build_object(
    //     'type',       'Feature',
    //     'id',         gid,
    //     'geometry',   ST_AsGeoJSON(geom)::jsonb,
    //     'properties', to_jsonb(inputs) - 'gid' - 'geom'
    //   ) AS feature
    //   FROM (SELECT * FROM shape_data."ptt geodata") inputs) features;
	
    // `
    return sequelizeString(sql)
}