const models = require('../models');
const { sequelizeString, sequelizeStringFindOne } = require('../util');
const uuid = require('uuid');


exports.shapeDataService = async (table_name) => {
    let sql = `  
    SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
            json_build_object(
                'type',       'Feature',
                'id',         gid,
                'geometry',   ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom,24047), 4326))::json,
                'properties', to_jsonb(row) - 'gid' - 'geom'))) AS shape 
        FROM  (SELECT * FROM shape_data."${table_name}") row `


    return await sequelizeStringFindOne(sql)
}

exports.findIdLayersShape = async (id) => {
    return await models.mas_layers_shape.findByPk(id)
}