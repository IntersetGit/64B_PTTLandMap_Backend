const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("geojson2shp");
const { addShapeService, getAllShape, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayers } = require('../service/shape_layers')
const fs = require('fs');
const uuid = require('uuid');
const config = require('../config');
const sequelize = require("../config/dbConfig");
const pg = require('pg');
const { shapeDataService } = require("../service/shape_data");

const _config = {
    development: {
        username: config.DB_USERNAME_DEV,
        password: config.DB_PASSWORD_DEV,
        database: config.DB_NAME_DEV,
        host: config.DB_HOST_DEV,
        dialect: config.DB_DIALECT_DEV,
        port: config.DB_PORT_DEV
    },
    test: {
        username: config.DB_USERNAME_TEST,
        password: config.DB_PASSWORD_TEST,
        database: config.DB_NAME_TEST,
        host: config.DB_HOST_TEST,
        dialect: config.DB_DIALECT_TEST,
        port: config.DB_PORT_TEST
    },
    production: {
        username: config.DB_USERNAME_PROD,
        password: config.DB_PASSWORD_PROD,
        database: config.DB_NAME_PROD,
        host: config.DB_HOST_PROD,
        dialect: config.DB_DIALECT_PROD,
        port: config.DB_PORT_PROD
    }
}

exports.demoCreateDatabase = async (req, res, next) => {
    try {
        const {username, password, database, port, host} = _config[config.NODE_ENV];

        const pool = new pg.Pool({
            user: username,
            host,
            database,
            password: password,
            port
        });
        await pool.query('CREATE TABLE shape_data.shape_layers_new', (err, res) => {
            console.log(err, res);
            if(err) result(res, err, 500)
            else result(res, res)
            
            pool.end();
        })

        
    } catch (error) {
        next(error);
    }
}


exports.shapeAdd = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {

        if (!req.files) {
            const err = new Error('ต้องการไฟล์เพื่ออัพโหลด')
            err.statusCode = 404
            throw err
        } else {
            const { file } = req.files
            const { color, group_layer_id, name_layer, type, text_table } = req.body
            const { sysm_id } = req.user

            const geojson = await shp(file.data.buffer);
            console.log(geojson);
            // const shapefiles = await 
            const id = uuid.v4()
            

            await addShapeLayers({
                id,
                name_layer,
                table_name: geojson.fileName,
                type,
                group_layer_id,
                color
            }, transaction)

            for (const i in geojson.features) {
                if (Object.hasOwnProperty.call(geojson.features, i)) {
                    const e = geojson.features[i];
                    console.log(`object`, e.geometry)
                    console.log(`object`, e.properties)

                    await addShapeService({
                        shape_id: id,
                        objectid: e.properties.OBJECTID,
                        project_na: e.properties.PROJECT_NA,
                        parid: e.properties.PARID,
                        kp: e.properties.KP,
                        partype: e.properties.PARTYPE,
                        parlabel1: e.properties.PARLABEL1,
                        parlabel2: e.properties.PARLABEL2,
                        parlabel3: e.properties.PARLABEL3,
                        parlabel4: e.properties.PARLABEL4,
                        parlabel5: e.properties.PARLABEL5,
                        prov: e.properties.PROV,
                        amp: e.properties.AMP,
                        tam: e.properties.TAM,
                        area_rai: e.properties.AREA_RAI,
                        area_ngan: e.properties.AREA_NGAN,
                        area_wa: e.properties.AREA_WA,
                        parcel_own: e.properties.PARCEL_OWN,
                        parcel_o_1: e.properties.PARCEL_O_1,
                        parcel_o_2: e.properties.PARCEL_O_2,
                        row_rai: e.properties.ROW_RAI,
                        row_ngan: e.properties.ROW_NGAN,
                        row_wa: e.properties.ROW_WA,
                        row_distan: e.properties.ROW_DISTAN,
                        status: e.properties.STATUS,
                        remark: e.properties.REMARK,
                        shape_leng: e.properties.Shape_Leng,
                        shape_area: e.properties.Shape_Area,
                        area_geometry: e.geometry,
                        user_id: sysm_id,
                        created_by: sysm_id
                    }, transaction)
                }
            }
            await transaction.commit();
            result(res, id, 201);
        }
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
}

exports.convertGeoToShp = async (req, res, next) => {
    try {
        const features = [req.body];
        const options = {
            layer: "PTT",
            targetCrs: 2154,
        }
        const id = features[0].id

        await convert(features, `public/shapfile/PTT-${id}.zip`, options)

        // const _res = async (features, config) => {
        //     await download(`${config.SERVICE_HOST}/${features[0].id}`, `public`)
        //     fs.writeFileSync(`public/shapfile/${features[0].id}`, await download(`${config.SERVICE_HOST}/${features[0].id}`))

        //     download(`${config.SERVICE_HOST}/${features[0].id}`).pipe(fs.createWriteStream(`public/shapfile/${features[0].id}`))

        //     const data_ = await Promise.all([`${config.SERVICE_HOST}/${features[0].id}`].map(url => download(url, 'public')))

        //     return data_
        // };

        result(res, _res)

    } catch (error) {
        next(error);
    }
}

exports.getAllDataLayer = async (req, res, next) => {
    try {
        const get_shp = await getDataShapService()
        result(res, get_shp)

    } catch (error) {
        next(error);
    }
}

//--------- แสดงข้อมูล shp -----------//
exports.getShapeData = async (req, res, next) => {
    try {
        const { id } = req.query
        result(res, await shapeDataService(id))

    } catch (error) {
        next(error);
    }
}