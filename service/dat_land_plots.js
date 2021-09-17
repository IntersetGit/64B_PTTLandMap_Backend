const models = require('../models/index')
const uuid4 = require('uuid')
const { Op } = require('sequelize')
const { sequelizeString } = require('../util')

exports.addShapeService = async (table, geojson) => {
    console.log(geojson);
    console.log(table.obj.newObject);
    let arr = []
    const typeGeom = {"type": "MULTIPOLYGON"}
    for (let i = 0; i < geojson.features.length; i++) {
        const data = geojson.features[i];
        data.properties = Object.values(data.properties)
        // console.log(data.properties);
        console.log(data.geometry.coordinates);

        data.properties = data.properties.map(e => String(`'${e}'`))
        // console.log(data.properties);
        let sql = `INSERT INTO shape_data.${table.obj.nameTable}(geom,${table.obj.newObject}) VALUES ('${data.geometry}',${data.properties}) `
        await sequelizeString(sql);

        // let geometry = {"type": "Polygon"}
        // geometry.coordinates = data.geometry.coordinates
        // console.log(geometry);

        

        
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