const models = require('../models/index')
const uuid4 = require('uuid')
const { Op } = require('sequelize')
const { sequelizeString } = require('../util')

exports.addShapeService = async (table, geojson) => {
    // console.log(geojson);
    // console.log(table.obj.newObject);
    /* format insert
    INSERT INTO shape_data.ptt_shape_number3(gid,geom) VALUES (1, ST_GeomFromGeoJSON('{"type":"MultiPolygon","coordinates":[[[[99.557856126,14.277867442],[99.637387048,14.297762334],[99.633280354,14.232705561],[99.555778959,14.230984626],[99.557856126,14.277867442]]]]}')) 
    */

    for (let i = 0; i < geojson.features.length; i++) {
        const data = geojson.features[i];
        data.properties = Object.values(data.properties)
        // console.log(data.properties);
        console.log(data.geometry.coordinates);

        for (let a = 0; a < data.geometry.coordinates.length; a++) {
            const geo = data.geometry.coordinates[a];
            data.properties = data.properties.map(e => String(`'${e}'`))
            // console.log(data.properties);
            let sql = `INSERT INTO shape_data.${table.obj.nameTable}(geom,${table.obj.newObject}) VALUES (ST_GeomFromGeoJSON('{
            "type":"MultiPolygon",
            "coordinates":[[[ [${geo[0][0]} , ${geo[0][1]}] , [${geo[1][0]} , ${geo[1][1]}] , [${geo[2][0]} , ${geo[2][1]}] , [${geo[3][0]} , ${geo[3][1]}] , [${geo[4][0]} , ${geo[4][1]}] ]]]
            }'),${data.properties}) `
            await sequelizeString(sql);
        }
    }
}

exports.getDataLayerService = async () => {
    let sql = `
        SELECT id
        ,shape_id
        ,objectid
        ,project_na
        ,parid
        ,kp
        ,mas_prov_id AS prov_id
        ,(SELECT prov.prov_name_th FROM master_lookup.mas_province prov WHERE prov.id = mas_prov_id) AS prov_name
        ,mas_dist_id AS dist_id
        ,(SELECT dis.name_th FROM master_lookup.mas_district dis WHERE dis.id = mas_dist_id) AS dist_name
        ,mas_subdist_id AS sub_id
        ,(SELECT sub.name_th FROM master_lookup.mas_subdistrict sub WHERE sub.id = mas_subdist_id) AS sub_name
        ,area_geometry
        ,parcel_own
        ,parcel_o_1
        ,parcel_o_2

        FROM ptt_data.dat_land_plots 
        WHERE isuse = 1
    `

    return await sequelizeString(sql);
}