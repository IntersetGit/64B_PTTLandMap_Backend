const models = require('../models');
const { sequelizeString, sequelizeStringFindOne } = require('../util');
const uuid = require('uuid');


exports.shapeDataService = async () => {
    let sql = `  
    (SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) AS shape
      FROM (
      SELECT jsonb_build_object(
        'type',       'Feature',
        'id',         gid,
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs)
      ) AS feature
      FROM (SELECT * FROM shape_data."ptt geodata") inputs) features) `

    return await sequelizeStringFindOne(sql)
}