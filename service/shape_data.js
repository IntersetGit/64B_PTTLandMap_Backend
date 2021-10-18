const models = require('../models');
const { sequelizeString, sequelizeStringFindOne, stringToSnakeCase } = require('../util');
const uuid = require('uuid');
const { DataTypes } = require("sequelize"); //type Database
const { SequelizeAuto } = require('sequelize-auto');
const sequelize = require("../config/dbConfig"); //connect database


exports.shapeDataService = async (table_name) => {
    let sql = `  
    SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
            json_build_object(
                'type',       'Feature',
                'id',         gid,
                'geometry',   ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom,4326), 4326))::json,
                'properties', to_jsonb(row) - 'gid' - 'geom'))) AS shape 
        FROM  (SELECT * FROM shape_data.${table_name}) row `


    return await sequelizeStringFindOne(sql)
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

exports.getAllShapeDataService = async(search, value) => {
    //ค้นหาชื่อตารางทั้งหมดใน shape_data
    const table_name = await sequelizeString(`  
    SELECT * FROM information_schema.tables
    WHERE table_schema = 'shape_data' `)

    //สร้างตัวแปลเพื่อเก็บข้อมูล project_na, prov, amp, tam ของแต่ละ table ที่ Select มา
    const KeepData = [], arr_sql = []
	var sql, _res
    //วนลูปเพื่อเอาข้อมูล project_na, prov, amp, tam ของแต่ละ Table มา

    if(search) {
        if(value == "project_na" || "partype"){ 
            for (const i in table_name) {
                if (Object.hasOwnProperty.call(table_name, i)) {
                    const datas = table_name[i];
                    const filterColumnSql = await sequelizeString(` SELECT * FROM  shape_data.${datas.table_name}`) //เรียกตารางใน shape_data
                    // console.log(filterColumnSql);
                    for (let e = 0; e < filterColumnSql.length; e++) {
                        let element = filterColumnSql[e];
                        element = Object.keys(element) //เซ็ตค่าใหม่เป็น key
                        for (let x = 0; x < element.length; x++) {
                            const values = element[x];
                            if(values == value){
                                sql = `SELECT * FROM shape_data.${datas.table_name} WHERE ${value} ILIKE '%${search}%'`
                                _res = await sequelizeString(sql)
                                arr_sql.push(_res)
                            }
                        }
                    }
                }
            }
        }
        
    } else {
        for (const i in table_name) {
            if (Object.hasOwnProperty.call(table_name, i)) {
                KeepData.push(table_name[i].table_name)
            }
        }
    
        for (const a in KeepData) {
            if (Object.hasOwnProperty.call(KeepData, a)) {
                const e = KeepData[a]
                // console.log(e);
                // arr_sql.push(`shape_data.${e}`)
                sql = `SELECT * FROM shape_data.${e} `
                _res = await sequelizeString(sql)
                arr_sql.push(_res)
            }
        }
    }

    
    return arr_sql

}