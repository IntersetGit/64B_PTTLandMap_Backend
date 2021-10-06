const models = require('../models');
const { sequelizeString, sequelizeStringFindOne } = require('../util');
const uuid = require('uuid');
const { DataTypes } = require("sequelize"); //type Database
const { SequelizeAuto }  = require('sequelize-auto');
const sequelize  = require("../config/dbConfig"); //connect database


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

exports.createTableShapeService = async (geojson, transaction, queryInterface) => {

    var obj = {};
    var obj1 = {}
    // console.log(geojson);
    const countTable = await sequelizeStringFindOne(` 
        SELECT COUNT(*) AS tables
        FROM information_schema.tables
        WHERE table_schema  = 'shape_data'
    `)
    obj.nameTable = `ptt_shape_number${Number(countTable.tables) + 1}`

    for (let i = 0; i < geojson.features.length; i++) {
        const e = geojson.features[i];
        // console.log(e.properties);
        obj.newObject = Object.keys(e.properties) //เอาชื่อตัวแปรมาใช้
        obj.newObject = obj.newObject.map(e => e.toLowerCase())
        obj.newObject.forEach(colomn => {
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
            /* loop ใส่ type*/
            obj1[colomn] = {
                type: DataTypes.STRING,
                allowNull: true
            }

        })
        // console.log(obj1.amp);
    }

    await queryInterface.createTable(`${obj.nameTable}`, obj1, {
        schema: "shape_data"
    }, { transaction })

    // const auto = new SequelizeAuto(sequelize, null, null, {
    //     caseFile: 'o', 
    //     caseModel: 'o', 
    //     caseProp: 'o'
    // })
    // auto.run();

    return {
        column: obj1,
        obj
    }
}

exports.createTableKmlService = async (geodata, transaction, queryInterface) => {

    var obj = {};
    var obj1 = {}
    // console.log(geojson);
    const countTable = await sequelizeStringFindOne(` 
        SELECT COUNT(*) AS tables
        FROM information_schema.tables
        WHERE table_schema  = 'shape_data'
    `)
    obj.nameTable = `ptt_Kml_number${Number(countTable.tables) + 1}`

    for (let i = 0; i < geodata.features.length; i++) {
        const e = geodata.features[i];
        // console.log(e.properties);
        obj.newObject = Object.keys(e.properties) //เอาชื่อตัวแปรมาใช้
        obj.newObject = obj.newObject.map(e => e.toLowerCase())
        obj.newObject.forEach(colomn => {
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
            /* loop ใส่ type*/
            obj1[colomn] = {
                type: DataTypes.STRING,
                allowNull: true
            }

        })
        // console.log(obj1.amp);
    }

    await queryInterface.createTable(`${obj.nameTable}`, obj1, {
        schema: "shape_data"
    }, { transaction })

    // const auto = new SequelizeAuto(sequelize, null, null, {
    //     caseFile: 'o', 
    //     caseModel: 'o', 
    //     caseProp: 'o'
    // })
    // auto.run();

    return {
        column: obj1,
        obj
    }
}