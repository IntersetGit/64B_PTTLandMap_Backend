const models = require('../models');
const { sequelizeString, sequelizeStringFindOne, stringToSnakeCase } = require('../util');
const uuid = require('uuid');
const { DataTypes } = require("sequelize"); //type Database
const { SequelizeAuto } = require('sequelize-auto');
const sequelize = require("../config/dbConfig"); //connect database

//ค้นหาชื่อตารางทั้งหมดใน shape_data
const func_table_name = async () => {
    return await sequelizeString(`  
    SELECT * FROM information_schema.tables
    WHERE table_schema = 'shape_data' `)
}

exports.shapeDataService = async (table_name, id) => {

    const filter_table_name = await models.mas_layers_shape.findOne({where: { table_name }})
    if (filter_table_name || filter_table_name.table_name != '' && filter_table_name.table_name != null) {

        let sql = `  
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type',       'Feature',
                    'id',         gid,
                    'geometry',   ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom,4326), 4326))::json,
                    'properties', to_jsonb(row) - 'gid' - 'geom'))) AS shape `

        if (id) sql += ` FROM  (SELECT * FROM shape_data.${table_name} WHERE gid = ${id}) row`
        else sql += ` FROM  (SELECT * FROM shape_data.${table_name}) row `
        return await sequelizeStringFindOne(sql)

    } else []
    
}

exports.findIdLayersShape = async (id) => {
    return await models.mas_layers_shape.findByPk(id)
}

exports.createTableShapeService = async (geojson, queryInterface, type) => {

    var obj = {};
    var obj1 = {}
    var schema = ``

    if (type.toLowerCase() == "shape file".toLowerCase()) schema += `shape_data`
    if (type.toLowerCase() == "kml".toLowerCase()) schema += `kml_data`
    if (type.toLowerCase() == "kmz".toLowerCase()) schema += `kmz_data`

    // console.log(geojson);
    const countTable = await sequelizeStringFindOne(` 
        SELECT COUNT(*) AS tables
        FROM information_schema.tables
        WHERE table_schema  = '${schema}'
    `)

    if (type.toLowerCase() == "shape file".toLowerCase()) {
        obj.nameTable = `ptt_shape_number${Number(countTable.tables) + 1}`
    } else if (type.toLowerCase() == "kml".toLowerCase()) {
        obj.nameTable = `ptt_kml_number${Number(countTable.tables) + 1}`
    } else {
        obj.nameTable = `ptt_kmz_number${Number(countTable.tables) + 1}`
    }

    const arrPropertie = []

    for (let i = 0; i < geojson.features.length; i++) {
        const e = geojson.features[i];
        // console.log(e.properties);
        obj.newObject = Object.keys(e.properties) //เอาชื่อตัวแปรมาใช้
        obj.newObject = obj.newObject.map(e => e.toLowerCase())
        obj.newObject = obj.newObject.map(str => stringToSnakeCase(str)) //แปลงเป็น SnakeCase
        arrPropertie.push(obj.newObject)

    }
    const newArrPropertie = arrPropertie.length > 0 ? arrPropertie[arrPropertie.length - 1] : []
    if (newArrPropertie.length > 0) {

        obj1.gid = {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true,
        },
        obj1.geom = {
            type: DataTypes.GEOMETRY('MultiPolygon', 0),
            allowNull: true,
        }
        newArrPropertie.forEach(colomn => {
            /* loop ใส่ type*/
            obj1[colomn] = {
                type: DataTypes.STRING,
                allowNull: true
            }

        })

    } else {
        const err = new Error('ผิดพลาดไม่สามารถสร้างฐานข้อมูลได้')
        err.statusCode = 400
        throw err
    }

    // console.log(typeof new Date());

    await queryInterface.createTable(`${obj.nameTable}`, obj1, { schema })

    // const auto = new SequelizeAuto(sequelize, null, null, {
    //     caseFile: 'o', 
    //     caseModel: 'o', 
    //     caseProp: 'o'
    // })
    // auto.run();

    return {
        obj,
        schema
    }
}

/* เรียกข้อมูลทั้งหมด shape_data */

exports.getAllShapeDataService = async (search, project_name, limit) => {

    const table_name = await func_table_name()

    //สร้างตัวแปลเพื่อเก็บข้อมูล project_na, prov, amp, tam ของแต่ละ table ที่ Select มา
    const KeepData = [], arr_sql = [], amount = []
    var sql, _res, sql_count
    //วนลูปเพื่อเอาข้อมูล project_na, prov, amp, tam ของแต่ละ Table มา

    if (search) {

        for (let a = 0; a < table_name.length; a++) {
            const tables = table_name[a];
            if (project_name == "objectid" || "project_na" || "parlabel1" ) {
                _res = await sequelizeString(`SELECT * FROM shape_data.${tables.table_name} WHERE ${project_name} ILIKE '%${search}%' `)
                sql_count =  await sequelizeStringFindOne(`SELECT COUNT(*) AS amount_data FROM shape_data.${tables.table_name} WHERE ${project_name} ILIKE '%${search}%' `)
                amount.push(sql_count.amount_data)
                _res.forEach(e => {
                    if (e.partype === "โฉนดที่ดิน" || "น.ส.4") e.color = "#FF0000" //แดง
                    else if (e.partype === "น.ส.3ก.") e.color = "#049B06" //เขียว
                    else if (e.partype === "น.ส.3" || "น.ส.3ข.") e.color = "#000000" //ดำ
                    else if (e.partype === "สปก.4-01") e.color = "#0115C3" //ฟ้า
                    else e.color = "#626262" //เทา

                    e.table_name = tables.table_name
                    arr_sql.push(e)
                })
               
            }
        }

    } else {

        //เรียกข้อมูลทั้งหมด schema shape
        for (const i in table_name) {
            if (Object.hasOwnProperty.call(table_name, i)) {
                KeepData.push(table_name[i].table_name)
            }
        }

        for (const a in KeepData) {
            if (Object.hasOwnProperty.call(KeepData, a)) {
                const e = KeepData[a]
                _res = await sequelizeString(`SELECT * FROM shape_data.${e} `)
                sql_count =  await sequelizeStringFindOne(`SELECT COUNT(*) AS amount_data FROM shape_data.${e} `)
                amount.push(sql_count.amount_data)
                _res.forEach((x) => {
                    if (x.partype === "โฉนดที่ดิน" || "น.ส.4") x.color = "#FF0000" //แดง
                    else if (x.partype === "น.ส.3ก.") x.color = "#049B06" //เขียว
                    else if (x.partype === "น.ส.3" || "น.ส.3ข.") x.color = "#000000" //ดำ
                    else if (x.partype === "สปก.4-01") x.color = "#0115C3" //ฟ้า
                    else x.color = "#626262" //เทา

                    x.table_name = e
                    arr_sql.push(x)
                })

            }
        }
    }

    return { arr_sql, amount }

}

/* เรียกจังหวัด อำเภอตำบล ตามข้อมูลที่มีใน mas_layers_shape */
exports.getShapeProvinceMapService = async (layer_group, layer_shape) => {

    const KeepData = [], arr_sql = []
    var sql, _res

    if (layer_group) {
        const layers_data = await models.mas_layers_shape.findAll({ where: { group_layer_id: layer_group } })
        if (layers_data.length > 0) {
            layers_data.forEach(e => [
                KeepData.push(e.table_name)
            ])
    
        } else []
    
        for (const af in KeepData) {
            if (Object.hasOwnProperty.call(KeepData, af)) {
                const tables_name = KeepData[af];
                if (tables_name != '' && tables_name != null) {
                    _res = await sequelizeString(sql = `SELECT * FROM shape_data.${tables_name} `)
                    if (_res.length > 0) {
                        _res.forEach(province => {
                            const { prov, amp, tam } = province
                            arr_sql.push({ prov, amp, tam })
                        })
                    }
                }
            }
        }
    }

    if (layer_shape) {
        const layers_data_shape = await models.mas_layers_shape.findOne({ where: { id: layer_shape } })
        _res = await sequelizeString(sql = `SELECT * FROM shape_data.${layers_data_shape.table_name} `)
        if (_res.length > 0) {
            _res.forEach(province => {
                const { prov, amp, tam } = province
                arr_sql.push({ prov, amp, tam })
            })
        }
    }
    
    // [...new Set(arr_sql.map(({prov}) => prov.replace(/\n/g, '') ))], 
    // [...new Set(arr_sql.map(({amp}) => amp.replace(/\n/g, '') ))], 
    // [...new Set(arr_sql.map(({tam}) => tam.replace(/\n/g, '') ))] 

    const prov = [], amp = [], tam = []
    arr_sql.forEach((e, i) => {
        const i1 = prov.findIndex(x =>  x.name === e.prov.replace(/\n/g, ''))
        if (i1 === -1 && e.prov) {
            prov.push({
                id: i + 1,
                name: e.prov.replace(/\n/g, '')
            })
        }

        const i2 = amp.findIndex(x => x.name === e.amp.replace(/\n/g, ''))
        if (i2 === -1 && e.amp) {
            amp.push({
                id: i + 1,
                prov_id: prov[prov.findIndex(x => x.name === e.prov.replace(/\n/g, ''))].id,
                name: e.amp.replace(/\n/g, '')
            })
        }

        const i3 = tam.findIndex(x => x.name === e.tam.replace(/\n/g, ''))
        if (i3 === -1 && e.tam) {
            tam.push(({
                id: i + 1,
                amp_id: amp[amp.findIndex(x => x.name === e.amp.replace(/\n/g, ''))].id,
                name: e.tam.replace(/\n/g, '')
            }))
        }
    });


    return { 
        prov,
        amp,
        tam
    }

}

/* ค้นหา จังหวัด อำเภอ ตำบล */
exports.searchDataShapeProvAmpTamMapService = async (prov, amp, tam) => {

    const table_name = await func_table_name()
    const KeepData = [], arr_sql = []
    var sql, _res

    if (table_name.length > 0) {
        for (const key in table_name) {
            if (Object.hasOwnProperty.call(table_name, key)) {
                const tables = table_name[key];
                if (prov) {
                    var wheresql = ''
                    if (amp) {
                        wheresql += ` and amp = '${amp}' `
                    }
                    if (tam) {
                        wheresql += ` and tam = '${tam}' `
                    }
                    sql = await sequelizeString(` SELECT * FROM shape_data.${tables.table_name} WHERE prov = '${prov}' ${wheresql} `)
                    
                    sql.forEach(provs => {
                        provs.table_name = tables.table_name
                        arr_sql.push(provs)
                    })
                } 
            }
        }
    } 
    
    return  (arr_sql.length > 0) ?  arr_sql : []

}


/* แก้ไขข้อมูล shape */
exports.editshapeDataService = async (model, gid) =>{

    const filter_shapedata = await models.mas_layers_shape.findOne({where: {table_name: model.table_name}})

    if (!filter_shapedata) { 
        const err = new Error('ไม่พบชั้นข้อมูล')
        err.statusCode = 404
        throw err
    }
    let str_sql = `UPDATE shape_data.${filter_shapedata.table_name} SET `

    let _keys = Object.keys(model)
    _keys = _keys.splice(0,_keys.length - 2)

    let _value =  Object.values(model)
    _value = _value.splice(0,_value.length - 2)
    console.log(_keys);
    console.log(_value);

        for (const i in _keys) {
            if (Object.hasOwnProperty.call(_keys, i)) {
                const keys = _keys[i];
                const value = _value[i];
               if (keys != 'table_name' && i<2) {
                str_sql += ` ${keys} = '${value}' `
            }else if (keys != 'table_name'){
                str_sql += ` ,${keys} = '${value}' `
            }
            }
        }
    
         str_sql += ` WHERE gid = ${gid}`
    // _keys.forEach(column => {
    //     if (column != 'table_name') {
    //         str_sql += ` ${column} = `
    //     }
        
    // })
    // _value.forEach(val => {
    //     str_sql += ` ${val}`
    // })

    
    console.log(str_sql);
    
     return await sequelizeString(str_sql)
    // const _sqlll = await sequelizeString(str_sql);
    // console.log(_sqlll);
    // return _sqlll
   
    

    
    // const sql = await sequelizeString(`SELECT * FROM shape_data.${filter_shapedata.table_name}` );
    // sql.forEach(e => {
    //     console.log(e);
    // })



    // const arr_sql = []
    // var sql = `UPDATE shape_data.${tables.table_name} SET remark `, _res_sql

    // if (table_name.length > 0) {
    //     for (const aa in table_name) {
    //         if (Object.hasOwnProperty.call(table_name, aa)) {
    //             const tables = table_name[aa];
    //             var _model = []
                
                
    //             if(remark){
                     
    //                 sql = await sequelizeString(` UPDATE shape_data.${tables.table_name} SET remark = '${remark}'  WHERE id = '${gid}' `)

    //                 sql.forEach(_remarks => {
    //                     _remarks.table_name = tables.table_name
    //                     arr_sql.push(_remarks)
    //                 })
    //             }

    //           }
    //         }
    // } 
    // return  (arr_sql.length > 0) ?  arr_sql : []
}


/** ส่งมอบสิทธื์โครงการ 
 * เรียกข้อมูลสิทธิ์
*/

exports.getFromProjectService = async (search, project_name) => {

    const table_name = await func_table_name()
    const KeepData = [], arr_sql = []
    var sql, _res
    
    if (table_name.length > 0) {
        for (const a in table_name) {
            if (Object.hasOwnProperty.call(table_name, a)) {
                const element = table_name[a];
                sql = await sequelizeString(`SELECT status FROM shape_data.${element.table_name} `)
                sql.forEach(e => {
                    arr_sql.push(e)
                })
                
            }
        }
    }

    // if (search) {
    //     for (const i in arr_sql) {
    //         if (Object.hasOwnProperty.call(arr_sql, i)) {
    //             const element = arr_sql[i];
    //             const { table_name } = element
    //             sql = await sequelizeString(` SELECT status FROM shape_data.${table_name} WHERE ${project_name} = ${search}`)
    //             sql.forEach(x => {
    //                 x.table_name = table_name
    //                 KeepData.push(x)
    //             })
               
    //         }
    //     }
    // } else {
    //     for (const i in arr_sql) {
    //         if (Object.hasOwnProperty.call(arr_sql, i)) {
    //             const element = arr_sql[i];
    //             const { table_name } = element
    //             sql = await sequelizeString(` SELECT status FROM shape_data.${table_name} `)
    //             sql.forEach(x => {
    //                 x.table_name = table_name
    //                 KeepData.push(x)
    //             })
    //         }
    //     }
    // }

    return { KeepData, arr_sql }

}


