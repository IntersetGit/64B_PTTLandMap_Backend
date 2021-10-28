const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("geojson2shp");
const { addShapeService, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayersService, addkmlLayersService } = require('../service/shape_layers')
const { findIdLayersShape, createTableShapeService, getAllShapeDataService, getShapeProvinceMapService, searchDataShapeProvAmpTamMapService,
    editshapeDataService, getFromProjectService, getProvAmpTamService } = require('../service/shape_data')
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
    const transaction = await sequelize.transaction();
    try {

        if (!req.files) {
            const err = new Error('ต้องการไฟล์เพื่ออัพโหลด')
            err.statusCode = 400
            throw err
        } else {
            const { file } = req.files
            const { color, group_layer_id, name_layer, type } = req.query
            const { sysm_id } = req.user
            const id = uuid.v4();
            const mimetype = `${file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase().toLowerCase()}`;

            if (type == "shape file") {
                if (mimetype == 'zip') {
                    const geojson = await shp(file.data.buffer); // แปลงไฟล์ shape
                    // console.log(geojson);
                    const _createTableShape = await createTableShapeService(geojson, queryInterface, type);
                    // console.log(_createTableShape);

                    await addShapeLayersService({
                        id,
                        name_layer,
                        table_name: _createTableShape.obj.nameTable,
                        type,
                        group_layer_id,
                        color_layer: color,
                        type_geo: _createTableShape.type_geo
                    }, transaction)

                    await addShapeService(_createTableShape, geojson);

                } else {
                    const err = new Error('Please file .zip only')
                    err.statusCode = 400
                    throw err
                }
            }

            if (type == "kml") {

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
                    color_layer: color,
                    type_geo: _createTableShape.type_geo
                }, transaction)

                await addShapeService(_createTableShape, geojson);
            }

            if (type == "kmz") {
                const _pathfile = await updataKmlKmz(file) //อัพไฟล์ kml
                const geojson = await KMZGeoJSON.toJson(_pathfile) // แปลงไฟล์ kmz
                // console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, type);
                // console.log(_createTableShape);
                await addShapeLayersService({
                    id,
                    name_layer,
                    table_name: _createTableShape.obj.nameTable,
                    type,
                    group_layer_id,
                    color_layer: color,
                    type_geo: _createTableShape.type_geo
                }, transaction)

                await addShapeService(_createTableShape, geojson);
            }

            await transaction.commit();
            result(res, { id, "file_type": type }, 201);
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
            if (e.children != null && e.children != '') {
                e.children.forEach(chd => {
                    chd.option_layer = chd.option_layer ?? {}
                    chd.type_geo = chd.type_geo ?? {}
                    chd.symbol_point = chd.symbol_point ?? {}
                })
            } else[]
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
        result(res, await shapeDataService(_res.table_name, null, _res.type))

    } catch (error) {
        next(error);
    }
}


//------------ แสดงข้อมูล search map ------------//
exports.getInfoProject = async (req, res, next) => {
    try {

        const { search, project_name, prov, amp, tam } = req.query
        const _res_sql = await getAllShapeDataService(search, project_name, prov, amp, tam)

        result(res, {
            data: _res_sql.arr_sql,
            amount_data: _res_sql.amount.reduce((sum, num) => Number(sum) + Number(num))
        })

    } catch (error) {
        next(error);
    }
}

/* ----------- เรียก จังหวัด อำเภอ ตำบล  ----------------      */
exports.getShapeProvinceMap = async (req, res, next) => {
    try {
        const { layer_group, layer_shape } = req.query
        result(res, await getShapeProvinceMapService(layer_group, layer_shape))

    } catch (error) {
        next(error);
    }
}


/* ------------ เรียกข้อมูล shape ด้วย id----------------- */
exports.getByidShapeMap = async (req, res, next) => {
    try {
        const { table_name, id } = req.query;

        result(res, await shapeDataService(table_name, id));

    } catch (error) {
        next(error);
    }
}


/* แก้ไขข้อมูล shape */

exports.editShapeMap = async (req, res, next) => {
    try {
        const model = req.body;
        result(res, await editshapeDataService(model));

    } catch (error) {
        next(error);
    }
}



/** ส่งมอบสิทธื์โครงการ 
 * เรียกข้อมูลสิทธิ์
 * Dashboard
**/
exports.getFromProjectDashboard = async (req, res, next) => {
    try {
        const { search, project_name, prov, amp, tam } = req.query
        const _res_sql = await getFromProjectService(search, project_name, prov, amp, tam);
        const { _temp, ___temp } = _res_sql
        const status = [], data = [], _status = [], _data = []

        _temp.forEach(e => {
            status.push(e.name)
            data.push(e.count)
        })
        ___temp.forEach(e => {
            _status.push(e.name)
            _data.push(e.row_distan)
        })

        result(res, {
            plot: { status, data },
            distance: { status: _status, data: _data }
        })
    } catch (error) {
        next(error);
    }
}

exports.checkUploadFile = async (req, res, next) => {
    var _type
    try {
        
        const { file } = req.files

        const type = `${file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase().toLowerCase()}`;
        const _check = ['zip', 'kml', 'kmz']
        if (_check.find(e => e == type)) {
            
            switch (type) {
                case "zip":
                    _type = "shape file"
                    break;
                case "kml":
                    _type = "kml"
                    break;
                case "kmz":
                    _type = "kmz"
                    break;
                default:
                    break;
            }

            if (_type === "shape file") {
                const geojson = await shp(file.data)
                geojson.features.forEach(e => {
                    _type = e.geometry.type == "Polygon" ? "shape file" : e.geometry.type
                })
            }

            if (_type === "kml") {
                const _pathfile = await updataKmlKmz(file);
                const geojson = await parseKML.toJson(_pathfile);
                geojson.features.forEach(e => {
                    _type = e.geometry.type == "Polygon" ? "shape file" : e.geometry.type
                })
            }

            if (_type === "kmz") {
                const _pathfile = await updataKmlKmz(file)
                const geojson = await KMZGeoJSON.toJson(_pathfile)
                geojson.features.forEach(e => {
                    _type = e.geometry.type == "Polygon" ? "shape file" : e.geometry.type
                })
            }

            result(res, {
                type: _type
            }, 200);

        } else {
            const err = new Error(`เลือกไฟล์ให้ถูกต้อง ${_check.toString()}`)
            err.statusCode = 400
            throw err
        }

    } catch (error) {
        if(_type === "shape file" || _type === "kml" || _type === "kmz") {
            const msg = {message: "อัพโหลดไฟล์ไม่ถูกต้อง"}
            msg.statusCode = 400
            next(msg)
        }
        next(error)
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


