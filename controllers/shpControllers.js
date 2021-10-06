const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("geojson2shp");
const { addShapeService, getDataLayerService,addkmlService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayersService, addkmlLayersService } = require('../service/shape_layers')
const { findIdLayersShape, createTableShapeService, getKmlService,createTableKmlService } = require('../service/shape_data')
const uuid = require('uuid');
const config = require('../config');
const sequelize = require("../config/dbConfig"); //connect database
const { shapeDataService } = require("../service/shape_data");
const { checkImgById } = require('../util');
const fs = require('fs')
const path = require("path");
const parseKML = require('parse-kml');
const KMZGeoJSON = require('parse2-kmz');


exports.shapeAdd = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    const queryInterface = await sequelize.getQueryInterface();
    try {

        if (!req.files) {
            const err = new Error('ต้องการไฟล์เพื่ออัพโหลด')
            err.statusCode = 302
            throw err
        } else {
            const { file } = req.files
            const { color, group_layer_id, name_layer, type } = req.query
            const { sysm_id } = req.user

            const id = uuid.v4();
            const geojson = await shp(file.data.buffer); // แปลงไฟล์ shape
            // console.log(geojson);
            const _createTableShape = await createTableShapeService(geojson, transaction, queryInterface);
            // console.log(_createTableShape);
            
            await addShapeLayersService({
                id,
                name_layer,
                table_name: _createTableShape.obj.nameTable,
                type,
                group_layer_id,
                color_layer: color
            }, transaction)

            await addShapeService(_createTableShape, geojson);

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
        // console.log(get_shp);

        for (let i = 0; i < get_shp.length; i++) {
            const e = get_shp[i];
            e.symbol = e.symbol ? await checkImgById(e.id, 'symbol_group') : null
        }

        result(res, get_shp)

    } catch (error) {
        next(error);
    }
}

//--------- แสดงข้อมูล shp -----------//
exports.getShapeData = async (req, res, next) => {
    try {
        const { id } = req.query
        const _res = await findIdLayersShape(id)
        result(res, await shapeDataService(_res.table_name))

    } catch (error) {
        next(error);
    }
}

exports.getKmlData = async (req, res, next) => {
    try {
        if (!req.files) {
            const err = new Error('ต้องการไฟล์ .kml')
            err.statusCode = 302
            throw err
        }
        const { kml } = req.files
        const _path = `${path.resolve()}/public/kmlfile/`;
        const _kml = `${_path}/${kml.name}`

        //เช็ค path ว่ามีไหม ถ้าไม่มีจะสร้างขึ้นมา
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }

        kml.mv(_kml, (err) => {
            if (err) {
                const error = new Error(err);
                error.statusCode = 400;
                throw error;
            }
        })
        const geodata = await parseKML.toJson(_kml)
        console.log(geodata);
        // const { color, group_layer_id, name_layer, type } = req.query

        // const transactionn = await sequelize.transaction();
        // const queryInterfacee = await sequelize.getQueryInterface();
        // const id = uuid.v4();


        // const _createTableKML = await createTableKmlService(geodata, transactionn, queryInterfacee);

        // await addkmlLayersService({
        //     id,
        //     name_layer,
        //     table_name: _createTableKML.obj.nameTable,
        //     type,
        //     group_layer_id,
        //     color_layer: color
        // }, transactionn)

        
        // // console.log("_createTableShap+++++++++++++++++++++++++++++++++++++++++++++++++e");
        // // console.log(_createTableKML.obj.nameTable);
        // // console.log(_createTableKML.obj.nameTable);
        // // console.log(_createTableKML.obj.nameTable);
        // // console.log(_createTableKML.obj.nameTable);
        // // console.log(_createTableKML.obj.nameTable);
        
        // await addkmlService(_createTableKML, geodata);

        // await transactionn.commit();
        result(res, geodata, 201);

        // result(res, geodata)
        
    } catch (error) {
        next(error);
    }
}

exports.getKmzData = async (req, res, next) => {
    try {
        if (!req.files) {
            const err = new Error('ต้องการไฟล์ .kmz')
            err.statusCode = 302
            throw err
        }

        const { kmz } = req.files
        const _path = `${path.resolve()}/public/kmzfile/`;
        const _kmz = `${_path}/${kmz.name}`

        //เช็ค path ว่ามีไหม ถ้าไม่มีจะสร้างขึ้นมา
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }

        kmz.mv(_kmz, (err) => {
            if (err) {
                const error = new Error(err);
                error.statusCode = 400;
                throw error;
            }
        })
        
        const geodata = await KMZGeoJSON.toJson(_kmz)
        
        for (let a = 0; a < geodata.features.length; a++) {
            for (let i = 0; i < geodata.features[a].geometry.coordinates.length; i++) {
                const e = geodata.features[a].geometry.coordinates[i];
                for (let z = 0; z < e.length; z++) {
                    const coordinates = e[z];
                    coordinates.length > 0 ? coordinates.pop() : []
                }
            }
        }

        result(res, geodata)
        
    } catch (error) {
        next(error);
    }
}