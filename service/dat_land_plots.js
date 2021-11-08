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
        const _tmp = [], arrMultiLineOut = []
        const data = geojson.features[i];
        data.properties = Object.values(data.properties)
        data.properties = data.properties.map(e => String(e).replace(/'/g, ''))
        data.properties = data.properties.map(e => `'${e}'`)

        if (schema === 'shape_data') {
            if (data.geometry.type === 'Polygon' || data.geometry.type === 'MultiPolygon') {
                for (let a = 0; a < data.geometry.coordinates.length; a++) {
                    const geo = data.geometry.coordinates[a];
                    const arr = []

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
            }

            // if (data.geometry.type === 'Polygon') {
            //     const poly = []
            //     data.geometry.coordinates.forEach(polyG => {
            //         polyG.forEach(_polyG => {
            //             poly.push(`[${_polyG}]`);
            //         })

            //     })
            //     arrSql.push(`(ST_GeomFromGeoJSON('{
            //         "type":"Polygon",
            //         "coordinates": [[${poly}]] 
            //         }'),${data.properties}) `)
            // }

            if (data.geometry.type === 'Point') {
                const arrPoint = []
                data.geometry.coordinates.forEach(point => {
                    if (data.geometry.coordinates.length <= 2) {
                        arrPoint.push(`[${point}]`);
                    }
                })
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"Point",
                    "coordinates": ${arrPoint} 
                    }'),${data.properties}) `)
            }

            if (data.geometry.type === 'LineString') {

            }
          
            if (data.geometry.type === 'MultiLineString') {
                const arrMultiLine = []
                data.geometry.coordinates.forEach(multiLine => {
                    const _arrMuti = []
                    multiLine.forEach(multiLines => {
                        _arrMuti.push(`[${multiLines}]`)
                    })
                    arrMultiLine.push(`[${_arrMuti}]`)
                });
                // arrMultiLine.push(arrMultiLineOut)
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"MultiLineString",
                    "coordinates":[${arrMultiLine}] 
                    }'),${data.properties}) `)

            }

            // if (data.geometry.type === 'MultiLineString') {
            //     arrSql.push(`(ST_GeomFromGeoJSON('{
            //         "type":"MultiLineString",
            //         "coordinates":[[${arrMultiLine}]] 
            //         }'),${data.properties}) `)
            // }
        }

        if (schema === 'kml_data') {
            if (data.geometry.type === 'MultiPolygon') {
                data.geometry.coordinates.forEach(a => {
                    const arr_kml = []
                    if (a.length > 1) {
                        a.forEach(val => {
                            if (val.length >= 3 && val[val.length - 1] == 0) val.pop() // ค่ามันมี 0 ตัด 0 ออก
                            arr_kml.push(`[${val}]`);
                        })
                    }
                    arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"MultiPolygon",
                        "coordinates":[[[ ${arr_kml} ]]]
                        }'),${data.properties}) `)
                })
            }

            if (data.geometry.type === 'Polygon') {
                const arrPolygon = []
                data.geometry.coordinates.forEach(poly => {
                    poly.forEach(polyes => {
                        arrPolygon.push(`[${polyes}]`);
                    })

                })
                arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"Polygon",
                        "coordinates":[[ ${arrPolygon} ]]
                        }'),${data.properties}) `)
            }

            if (data.geometry.type === 'PolygonZ') {
                const arrPolygon = []
                data.geometry.coordinates.forEach(poly => {
                    poly.forEach(polyes => {
                        arrPolygon.push(`[${polyes}]`);
                    })

                })
                arrSql.push(`(ST_GeomFromGeoJSON('{
                        "type":"Polygon",
                        "coordinates":[[ ${arrPolygon} ]]
                        }'),${data.properties}) `)
            }

            if (data.geometry.type === 'Point') {

            }

            if (data.geometry.type === 'LineString') {
                data.geometry.coordinates.forEach(LineStr => {
                    _tmp.push(`[${LineStr}]`)
                })
            }

            if (data.geometry.type === 'LineString') {
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"LineString",
                    "coordinates":[ ${_tmp} ]
                    }'),${data.properties}) `)
            }
        }

        if (schema === 'kmz_data') {
            if (data.geometry.type === 'Polygon') {
                const polygon = []
                data.geometry.coordinates.forEach(poly => {
                    if (poly.length > 0) {
                        polygon.push(poly)
                    }
                })
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"MultiPolygon",
                    "coordinates":[[[ ${polygon} ]]]
                    }'),${data.properties}) `)
            }

            if (data.geometry.type === 'Point') {

            }

            if (data.geometry.type === 'PointZ') {
                const pointZ = []
                data.geometry.coordinates.forEach(point => {
                    if (data.geometry.coordinates.length <= 2) {
                        pointZ.push(`[${point}]`);
                    }
                })
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"Point",
                    "coordinates": ${pointZ} 
                    }'),${data.properties}) `)
            }

            if (data.geometry.type === 'LineString') {
                const lineStr = []
                data.geometry.coordinates.forEach(line => {
                    if (line.length > 1) {
                        lineStr.push(`[${line}]`)
                    }
                })
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"LineString",
                    "coordinates": [${lineStr}]
                    }'),${data.properties}) `)
            }

            if (data.geometry.type === 'LineStringZ') {
                data.geometry.coordinates.forEach(LineStr => {
                    _tmp.push(`[${LineStr}]`)
                })
            }

            if (data.geometry.type === 'LineStringZ') {
                arrSql.push(`(ST_GeomFromGeoJSON('{
                    "type":"LineString",
                    "coordinates":[ ${_tmp} ]
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