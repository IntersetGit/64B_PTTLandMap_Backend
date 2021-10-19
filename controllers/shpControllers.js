const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("geojson2shp");
const { addShapeService, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayersService, addkmlLayersService } = require('../service/shape_layers')
const { findIdLayersShape, createTableShapeService, getAllShapeDataService, getShapeProvinceMapService, searchDataShapeProvAmpTamMapService } = require('../service/shape_data')
const uuid = require('uuid');
const config = require('../config');
const sequelize = require("../config/dbConfig"); //connect database
const { shapeDataService } = require("../service/shape_data");
const { checkImgById } = require('../util');
const fs = require('fs')
const path = require("path");
const parseKML = require('parse-kml');
const KMZGeoJSON = require('parse2-kmz');


exports.shapeKmlKmzAdd = async (req, res, next) => {
    const queryInterface = await sequelize.getQueryInterface();
    const transaction  = await sequelize.transaction ();
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

            if(type == "shape file") {
                const geojson = await shp(file.data.buffer); // แปลงไฟล์ shape
                // console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, type);
                console.log(_createTableShape);
                
                await addShapeLayersService({
                    id,
                    name_layer,
                    table_name: _createTableShape.obj.nameTable,
                    type,
                    group_layer_id,
                    color_layer: color
                }, transaction )

                await addShapeService(_createTableShape, geojson);
            }

            if(type == "kml") {

                const _pathfile = await updataKmlKmz(file) //อัพไฟล์ kml
                const geojson = await parseKML.toJson(_pathfile); // แปลงไฟล์ kml
                // console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, type);
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
            }

            if(type == "kmz") {
                const _pathfile = await updataKmlKmz(file) //อัพไฟล์ kml
                const geojson = await KMZGeoJSON.toJson(_pathfile) // แปลงไฟล์ kmz
                // console.log(geojson);

                geojson.features.forEach(a => {
                    const _coordinates = a.geometry.coordinates
                    if (_coordinates.length <= 1) {
                        _coordinates.forEach(e => {
                            if(e.length > 0) {
                                e.forEach(val => {
                                    val.length > 0 ? val.pop() : val
                                    console.log(val);
                                })
                            }
                        })
                    } else {
                        _coordinates.pop()
                    }
                })
                
                const _createTableShape = await createTableShapeService(geojson, queryInterface, type);
                // console.log(_createTableShape);
                
                await addShapeLayersService({
                    id,
                    name_layer,
                    table_name: _createTableShape.obj.nameTable,
                    type,
                    group_layer_id,
                    color_layer: color
                }, transaction )

                await addShapeService(_createTableShape, geojson);
            }
            await transaction.commit();
            result(res, {id, "file_type": type}, 201);
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
            e.symbol = await checkImgById(e.id, 'symbol_group')
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


//------------ แสดงข้อมูล search map ------------//
exports.getInfoProject = async (req, res, next) => {
    try {

        const { search, value, limit = 10 } = req.query
        const _res_sql = await getAllShapeDataService(search, value, limit)
        
        result(res, _res_sql)

    } catch (error) {
        next(error);
    }
}

/* ----------- เรียก จังหวัด อำเภอ ตำบล  ----------------      */
exports.getShapeProvinceMap = async (req, res, next) => {
    try {
        const { layer_group } = req.query
        result(res, await getShapeProvinceMapService(layer_group))
        
    } catch (error) {
        next(error);
    }
}
/* -------------- ค้นหา จังหวัด  อำเภอ ตำบล  ------------ */
exports.searchDataShapeProvAmpTamMap = async (req, res, next) => {
    try {
        const { prov, amp, tam } = req.query
        result(res, await searchDataShapeProvAmpTamMapService(prov, amp, tam))


    } catch (error) {
        next(error);
    }
}






const updataKmlKmz = (files) => {
    const _path = `${path.resolve()}/public/kmlfile/`;
    const _file = `${_path}/${files.name}`

    //เช็ค path ว่ามีไหม ถ้าไม่มีจะสร้างขึ้นมา
    if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
    }

    files.mv(_file, (err) => {
        if (err) {
            const error = new Error(err);
            error.statusCode = 400;
            throw error;
        }
    })

    return _file

}




