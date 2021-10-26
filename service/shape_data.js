const models = require('../models');
const { sequelizeString, sequelizeStringFindOne, stringToSnakeCase } = require('../util');
const uuid = require('uuid');
const { DataTypes } = require("sequelize"); //type Database
const { SequelizeAuto } = require('sequelize-auto');
const sequelize = require("../config/dbConfig"); //connect database
const lodash = require('lodash')

//ค้นหาชื่อตารางทั้งหมดใน shape_data
const func_table_name = async () => {
    return await sequelizeString(`  
    SELECT * FROM information_schema.tables
    WHERE table_schema = 'shape_data' `)
}

exports.shapeDataService = async (table_name, id) => {

    const filter_table_name = await models.mas_layers_shape.findOne({ where: { table_name } })
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

    } else[]

}

exports.findIdLayersShape = async (id) => {
    return await models.mas_layers_shape.findByPk(id)
}

exports.createTableShapeService = async (geojson, queryInterface, type) => {

    var obj = {};
    var obj1 = {}
    var schema = ``, type_geo

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

    const arrPropertie = [], typeData = [] , table_key = ["prov", "amp", "tam", "project_na", "parlabel1"]

    //ตรวจสอบประเภท type geo
    geojson.features.forEach(e => {type_geo = (e.geometry.type == 'Polygon') ? true : false })

    for (let i = 0; i < geojson.features.length; i++) {
        const e = geojson.features[i];
        // console.log(e.properties);
        obj.newObject = Object.keys(e.properties) //เอาชื่อตัวแปรมาใช้
        obj.newObject = obj.newObject.map(e => e.toLowerCase())
        obj.newObject = obj.newObject.map(str => stringToSnakeCase(str)) //แปลงเป็น SnakeCase
        arrPropertie.push(obj.newObject)
        // Object.values(e.properties).forEach(x => {
        //     typeData.push(typeof x)
        // })

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
            type: ((type_geo) ? DataTypes.GEOMETRY('MultiPolygon', 0) : DataTypes.GEOMETRY('Point', 0)) ,
            allowNull: true,
        }
        newArrPropertie.forEach(colomn => {
            /* loop ใส่ type*/
            const keys = table_key.find(key => key == colomn)
            if (keys) {
                obj1[colomn] = {
                    type: DataTypes.STRING ,
                    allowNull: true
                }
            } else {
                obj1[colomn] = {
                    type: DataTypes.STRING ,
                    allowNull: true
                },
                obj1.prov = {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                obj1.amp = {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                obj1.tam = {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                obj1.project_na = {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                obj1.parlabel1 = {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                obj1.status = {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                }
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
        schema,
        type_geo
    }
}

/* เรียกข้อมูลทั้งหมด shape_data */

exports.getAllShapeDataService = async (search, project_name, prov, amp, tam) => {

    const table_name = await func_table_name()
    const KeepData = [], arr_sql = [], amount = []
    var sql, _res, sql_count, val_sql = ``

    if (search) val_sql = ` AND ${project_name} ILIKE '%${search}%' `
    if (prov) val_sql += ` AND prov = '${prov}' `
    if (amp) val_sql += ` AND amp = '${amp}' `
    if (tam) val_sql += ` AND tam = '${tam}' `

    for (let a = 0; a < table_name.length; a++) {
        const tables = table_name[a];
        sql = await sequelizeString(`SELECT * FROM shape_data.${tables.table_name} WHERE gid IS NOT NULL ${val_sql} GROUP BY gid`)
        sql_count = await sequelizeStringFindOne(`SELECT COUNT(*) AS amount_data FROM shape_data.${tables.table_name} WHERE gid IS NOT NULL ${val_sql} `)
        amount.push(sql_count.amount_data)
        sql.forEach(e => {
            if (e.partype === "โฉนดที่ดิน" || e.partype === "น.ส.4") e.color = "#FF0000" //แดง
            else if (e.partype === "น.ส.3ก.") e.color = "#049B06" //เขียว
            else if (e.partype === "น.ส.3" || e.partype === "น.ส.3ข.") e.color = "#000000" //ดำ
            else if (e.partype === "สปก.4-01") e.color = "#0115C3" //ฟ้า
            else e.color = "#626262" //เทา

            e.table_name = tables.table_name
            arr_sql.push(e)
        })
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

        } else[]

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
        if (e.prov || e.amp || e.tam) {
            const i1 = prov.findIndex(x => x.name === e.prov.replace(/\n/g, ''))
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
        } else []
        
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

    return (arr_sql.length > 0) ? arr_sql : []

}


/* แก้ไขข้อมูล shape */
exports.editshapeDataService = async (model) =>{

    const filter_shapedata = await models.mas_layers_shape.findOne({ where: { table_name: model.table_name } })

    if (!filter_shapedata) { 
        const err = new Error('ไม่พบชั้นข้อมูล')
        err.statusCode = 404
        throw err
    }
    var str_sql = `UPDATE shape_data.${filter_shapedata.table_name} SET `
    var _format = ``, newKey = []

    for (const key in model) {
        if (key !== "table_name" && key !== "id") {
            newKey.push(` ${key} = '${model[key]}' `)
        }
    }
    str_sql += newKey.toString()
    str_sql += ` WHERE gid = ${model.gid}`
    return await sequelizeString(str_sql)
    
}


/** ส่งมอบสิทธื์โครงการ 
 * เรียกข้อมูลสิทธิ์
*/

exports.getFromProjectService = async (search, project_name, prov, amp, tam) => {

    const table_name = await func_table_name()
    const KeepData = [], arr_sql = []
    var sql, _res, val_sql = ``

    if (search) val_sql = ` AND ${project_name} ILIKE '%${search}%' `
    if (prov) val_sql += ` AND prov = '${prov}' `
    if (amp) val_sql += ` AND amp = '${amp}' `
    if (tam) val_sql += ` AND tam = '${tam}' `

    const status_shape = await models.mas_status_project.findAll({ order: [['sort', 'ASC']] })
    for (const i in status_shape) {
        if (Object.hasOwnProperty.call(status_shape, i)) {
            const statues = status_shape[i];
            for (const a in table_name) {
                if (Object.hasOwnProperty.call(table_name, a)) {
                    const element = table_name[a];
                    
                    sql = await sequelizeString(`SELECT COUNT(*)  FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql}  `)
                    sql.forEach(({ count }) => {
                        arr_sql.push({
                            count,
                            table_name: element.table_name,
                            name: statues.name,
                            status: statues.status_code
                        })
                    })
                }
            }
        }
    }


    const _temp = []
    arr_sql.forEach(e => {
        e.count = Number(e.count);
        const index = _temp.findIndex(x => x.name === e.name)
        if (index === -1) {
            _temp.push(e)
        } else {
            _temp[index].count += e.count
        }
    });


    return _temp

}

exports.getProvAmpTamService = async (prov, amp, tam) => {
    const table_name = await func_table_name()
    const KeepData = [], arr_sql = []
    var val_sql = ``, sql

    const status_shape = await models.mas_status_project.findAll({ order: [['sort', 'ASC']] })
    for (const i in status_shape) {
        if (Object.hasOwnProperty.call(status_shape, i)) {
            const statues = status_shape[i];
            for (const a in table_name) {
                if (Object.hasOwnProperty.call(table_name, a)) {
                    const element = table_name[a];
                    if (amp) val_sql += ` AND amp = ${amp}`
                    if (tam) val_sql += ` AND tam = ${tam}`
                    sql = await sequelizeString(`SELECT COUNT(*) FROM shape_data.${element.table_name} WHERE prov = '${prov}' AND status = '${statues.status_code}' ${val_sql} `)
                    sql.forEach(({ count }) => {
                        arr_sql.push({
                            count,
                            table_name: element.table_name,
                            name: statues.name,
                            status: statues.status_code
                        })
                    })
                }
            }
        }
    }
   

    arr_sql.forEach(e => {
        e.count = Number(e.count)
        const ind = KeepData.findIndex(a => a.name == e.name)
        if (ind == -1) KeepData.push(e)
        else  KeepData[ind].count += e.count
    })

    return KeepData


}


