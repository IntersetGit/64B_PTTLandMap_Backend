const models = require('../models/index')
const uuid4 = require('uuid')
const { Op } = require('sequelize')
const { sequelizeString } = require('../util')

exports.addShapeService = async (geojson, schema, arrNameTable, indexPropertie) => {
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
    // geojson.feature.forEach(data => {
    //     data.geometry.type
    // })
    var sql, typeGeo = []
    arrNameTable.forEach(tableName => {
        indexPropertie.forEach(newObject => {
            sql = `INSERT INTO ${schema}.${tableName}(geom,${newObject}) VALUES `
        })
    })
    
    let arrSql = [], property = []
    for (let i = 0; i < geojson.features.length; i++) {
        const _tmp = []
        const data = geojson.features[i];
        data.properties = Object.values(data.properties)
        data.properties = data.properties.map(e => String(e).replace(/'/g, ''))
        data.properties = data.properties.map(e => `'${e}'`)

        if (schema === 'shape_data') {
            for (let a = 0; a < data.geometry.coordinates.length; a++) {
                const geo = data.geometry.coordinates[a];
                const arr = []

                if (data.geometry.type === 'Polygon') { // polygon
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

                    arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"MultiPolygon",
                        "coordinates":[[[ ${arr} ]]]
                        }'),${data.properties}) `)
                }

                if (data.geometry.type === 'Point') { // point
                    if (data.geometry.coordinates.length <= 2) {
                        arr.push(`[${data.geometry.coordinates}]`)
                    }

                    arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"Point",
                        "coordinates": ${arr} 
                        }'),${data.properties}) `)
                }

                if (data.geometry.type === 'LineString') {

                }

                //loop พิกัด MultiLineString
                if (data.geometry.type === 'MultiLineString') {
                    if (geo.length > 0) {
                        geo.forEach(g => {
                            _tmp.push(`[${g}]`)
                        })
                    }
                }
            }
            
            if (data.geometry.type === 'MultiLineString') {
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"MultiLineString",
                    "coordinates":[[${_tmp}]] 
                    }'),${data.properties}) `)
            }
        }

        if (schema === 'kml_data') {
            data.geometry.coordinates.forEach(a => {
                const arr_kml = []

                if (data.geometry.type === 'Polygon') {
                    if (a.length > 1) {
                        a.forEach(val => {
                            // if (val.length >= 3 && val[val.length - 1] == 0) val.pop() // ค่ามันมี 0 ตัด 0 ออก
                            arr_kml.push(`[${val}]`)
                        })
                    }
                    arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"MultiPolygon",
                        "coordinates":[[[ ${arr_kml} ]]]
                        }'),${data.properties}) `)
                }

                if (data.geometry.type === 'PolygonZ') { // PolygonZ
                    if (a.length > 0) {
                        a.forEach(coordinate => {
                            if(coordinate.length > 2) {
                                arr_kml.push(`[${coordinate}]`)
                            }
                        })
                    }
                    arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"Polygon",
                        "coordinates":[[ ${arr_kml} ]]
                        }'),${data.properties}) `)
                }

                if (data.geometry.type === 'Point') { // point

                }

                if (data.geometry.type === 'LineString') { // LineString
                    data.geometry.coordinates.forEach(l => {
                        _tmp.push(`[${l}]`)
                    })
                }

            })
            if (data.geometry.type === 'LineString') {
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"LineString",
                    "coordinates":[[[ ${_tmp} ]]]
                    }'),${data.properties}) `)
            }
        }

        if (schema === 'kmz_data') {
            data.geometry.coordinates.forEach(kmz => {
                const arr_kmz = []

                if (data.geometry.type === 'Polygon') {
                    if (kmz.length > 0) {
                        kmz.forEach(e => {
                            arr_kmz.push(`[${e}]`)
                        })
                    }
                    arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"MultiPolygon",
                        "coordinates":[[[ ${arr_kmz} ]]]
                        }'),${data.properties}) `)
                }

                if (data.geometry.type === 'Point') { // point

                }

                if (data.geometry.type === 'LineString') { // LineString
                    data.geometry.coordinates.forEach(l => {
                        _tmp.push(`[${l}]`)
                    })
                    
                }
            })
            if (data.geometry.type === 'LineString') {
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"LineString",
                    "coordinates": [${_tmp}]
                    }'),${data.properties}) `)
            }
        }
    }

    
    sql += arrSql.toString()
    // console.log(sql);
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