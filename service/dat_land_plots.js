const models = require('../models/index')
const uuid4 = require('uuid')
const { Op } = require('sequelize')
const { sequelizeString } = require('../util')

exports.addShapeService = async (table, geojson) => {
    // console.log(geojson);
    // console.log(table.obj.newObject);

    // if (geojson) {
    //     geojson.features.forEach(x => {
    //         const _model = {}
    //         table.obj.newObject.forEach(e => {
    //             _model[e] = x.properties[e.toUpperCase()] ?? null 
    //         });
    //         arr.push(_model)
    //     });

    // }

    /* format insert
    INSERT INTO shape_data.ptt_shape_number3(gid,geom) VALUES (1, ST_GeomFromGeoJSON('{"type":"MultiPolygon","coordinates":[[[[99.557856126,14.277867442],[99.637387048,14.297762334],[99.633280354,14.232705561],[99.555778959,14.230984626],[99.557856126,14.277867442]]]]}')) 
    */

    var sql = `INSERT INTO ${table.schema}.${table.obj.nameTable}(geom,${table.obj.newObject}) VALUES `
    const arrSql = []
    for (let i = 0; i < geojson.features.length; i++) {
        const data = geojson.features[i];
        data.properties = Object.values(data.properties)
        data.properties = data.properties.map(e => `'${e}'`)

        for (let a = 0; a < data.geometry.coordinates.length; a++) {
            const geo = data.geometry.coordinates[a];
            const arr = []

            // console.log(geo);
            for (let x = 0; x < geo.length; x++) {
                const _geo = geo[x];
                if (_geo.length > 2) {
                    const temp = []
                    _geo.forEach(z => {
                        z.forEach(x => {
                            temp.push(x)
                        })
                    })

                    let i = 1
                    let tempArr = [], _data = []
                    temp.forEach(z => {
                        if (i == 2) {
                            tempArr.push(z)
                            _data.push(tempArr)
                            i = 1, tempArr = []
                        }
                        else {
                            tempArr.push(z), i++
                        }
                    })

                    _data.forEach(z => {
                        arr.push(`[${z}]`)
                    })

                } else {
                    arr.push(`[${_geo}]`)
                }
            }
            // console.log(data.properties);
            arrSql.push(`(ST_GeomFromGeoJSON('{
                "type":"MultiPolygon",
                "coordinates":[[[ ${arr} ]]]
                }'),${data.properties}) `)

        }
    }
    sql += arrSql.toString()
    console.log(sql);
    await sequelizeString(sql);

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