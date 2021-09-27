const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("geojson2shp");
const { addShapeService, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayersService } = require('../service/shape_layers')
const { findIdLayersShape, createTableShapeService, getKmlService } = require('../service/shape_data')
const uuid = require('uuid');
const config = require('../config');
const sequelize = require("../config/dbConfig"); //connect database
const { shapeDataService } = require("../service/shape_data");
const { checkImgById } = require('../util');
const kml = require('gtran-kml')

exports.shapeAdd = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    const queryInterface = await sequelize.getQueryInterface();
    try {

        if (!req.files) {
            const err = new Error('ต้องการไฟล์เพื่ออัพโหลด')
            err.statusCode = 404
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
        console.log(get_shp);

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

exports.gatKmlData = async (req, res, next) => {
    try {
        const { kmls } = req.files
        console.log(kmls);
        
        const data = await kml.toGeoJson(kmls.name, kmls.data)
        console.log(data);

        // await getKmlService(kml.data)
        result(res, data)
        
    } catch (error) {
        next(error);
    }
}