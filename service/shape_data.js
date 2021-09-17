const models = require('../models');
const { sequelizeString, sequelizeStringFindOne } = require('../util');
const uuid = require('uuid');
const { DataTypes } = require("sequelize"); //type Database


exports.shapeDataService = async (table_name) => {
    let sql = `  
    SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
            json_build_object(
                'type',       'Feature',
                'id',         gid,
                'geometry',   ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom,24047), 4326))::json,
                'properties', to_jsonb(row) - 'gid' - 'geom'))) AS shape 
        FROM  (SELECT * FROM shape_data."${table_name}") row `


    return await sequelizeStringFindOne(sql)
}

exports.findIdLayersShape = async (id) => {
    return await models.mas_layers_shape.findByPk(id)
}

exports.createTableShape = async (geojson, queryInterface) => {

    var obj = {};
    var obj1 = {}
    // console.log(geojson);
    const countTable =  await sequelizeStringFindOne(` 
        SELECT COUNT(*) AS tables
        FROM information_schema.tables
        WHERE table_schema  = 'shape_data'
    `)
    obj.nameTable = `ptt_shape_number${Number(countTable.tables) + 1}`

    for (let i = 0; i < geojson.features.length; i++) {
        const e = geojson.features[i];
        // console.log(e.properties);
        obj.newObject = Object.keys(e.properties) //เอาชื่อตัวแปรมาใช้
        obj.newObject = obj.newObject.map(e => {
            return e.toLowerCase()
        })
        obj.newObject.forEach(colomn => {
            obj1.gid = {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: true,
            },
            obj1.geom = {
                type: DataTypes.GEOMETRY('MULTIPOLYGON', 0),
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

    await queryInterface.createTable(`${obj.nameTable}`, obj1 ,{
        schema: "shape_data"
    })
    return {
        column: obj1,
        obj
    } 
}