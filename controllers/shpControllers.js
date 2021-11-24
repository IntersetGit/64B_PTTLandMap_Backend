const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("@timedata/geojson2shp-utf8");
const { addShapeService, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayersService, addkmlLayersService } = require('../service/shape_layers')
const { findIdLayersShape, createTableShapeService, getAllShapeDataService, getShapeProvinceMapService, searchDataShapeProvAmpTamMapService,
    editshapeDataService, getFromProjectService, getFromReportDashbordService, getFromReportDashbordServiceEach, getReportDashboardService } = require('../service/shape_data')
const uuid = require('uuid');
const config = require('../config');
const sequelize = require("../config/dbConfig"); //connect database
const { shapeDataService } = require("../service/shape_data");
const { checkImgById } = require('../util');
const fs = require('fs');
const path = require("path");
const parseKML = require('parse-kml');
const KMZGeoJSON = require('parse2-kmz');
const convertKml = require('tokml');
const convertKmz = require('gtran-kmz');
const CsvParser = require("json2csv").Parser;
const { errorUserNot } = require("../messages");
const http = require('http');
const xl = require('excel4node');
const { sequelizeString } = require("../util");




exports.shapeKmlKmzAdd = async (req, res, next) => {
    const queryInterface = await sequelize.getQueryInterface();
    const transaction = await sequelize.transaction();
    let schema, tables
    try {

        if (!req.files) {
            const err = new Error('ต้องการไฟล์เพื่ออัพโหลด')
            err.statusCode = 400
            throw err
        } else {
            const { file } = req.files
            const option_layer = req.body.option_layer ? JSON.parse(req.body.option_layer) : {}
            const { color, group_layer_id, name_layer, type } = req.query
            const { sysm_id } = req.user
            const id = uuid.v4();
            const mimetype = `${file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase().toLowerCase()}`;

            if (mimetype == 'zip') {

                const geojson = await shp(file.data); // แปลงไฟล์ shape
                // console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, mimetype);
                // console.log(_createTableShape);
                tables = _createTableShape.arrNameTable
                schema = _createTableShape.schema

                await addShapeLayersService({
                    id,
                    name_layer,
                    table_name: _createTableShape.arrNameTable[0],
                    type: "shape file",
                    group_layer_id,
                    color_layer: color,
                    option_layer: option_layer,
                    type_geo: type
                }, transaction)

                await addShapeService(geojson, _createTableShape.schema, _createTableShape.arrNameTable, _createTableShape.indexPropertie);

            }

            if (mimetype == 'kml') {
                const _pathfile = await updataKmlKmz(file) //อัพไฟล์ kml
                const geojson = await parseKML.toJson(_pathfile); // แปลงไฟล์ kml
                // console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, mimetype);
                // console.log(_createTableShape);
                tables = _createTableShape.arrNameTable
                schema = _createTableShape.schema

                await addShapeLayersService({
                    id,
                    name_layer,
                    table_name: _createTableShape.arrNameTable[0],
                    type: "kml",
                    group_layer_id,
                    color_layer: color,
                    option_layer: option_layer,
                    type_geo: type
                }, transaction)

                await addShapeService(geojson, _createTableShape.schema, _createTableShape.arrNameTable, _createTableShape.indexPropertie)

            }

            if (mimetype == 'kmz') {
                const _pathfile = await updataKmlKmz(file) //อัพไฟล์ kml
                const geojson = await KMZGeoJSON.toJson(_pathfile) // แปลงไฟล์ kmz
                // console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, mimetype);
                // console.log(_createTableShape);
                tables = _createTableShape.arrNameTable
                schema = _createTableShape.schema

                await addShapeLayersService({
                    id,
                    name_layer,
                    table_name: _createTableShape.arrNameTable[0],
                    type: "kmz",
                    group_layer_id,
                    color_layer: color,
                    option_layer: option_layer,
                    type_geo: type
                }, transaction)

                await addShapeService(geojson, _createTableShape.schema, _createTableShape.arrNameTable, _createTableShape.indexPropertie);

            }

            await transaction.commit();
            result(res, { id, "file_type": type }, 201);
        }
    } catch (error) {
        if (transaction) await transaction.rollback();
        if (tables && schema) {
            for (let i = 0; i < tables.length; i++) {
                const e = tables[i];
                await queryInterface.dropTable({
                    tableName: e,
                    schema,
                })
            }
        }
        next(error);
    }
}



exports.convertGeoJson = async (req, res, next) => {
    try {

        let { id, type } = req.query;
        const { table_name, name_layer } = await findIdLayersShape(id);
        const { shape } = await shapeDataService(table_name);
        const uuid4 = uuid.v4()
        type = type.toLowerCase()

        if (!shape) {
            const err = new Error(errorUserNot)
            err.statusCode = 404
            throw err
        } else {
            if (type === 'shape file') {
                const options = {
                    layer: name_layer,
                    targetCrs: 2154,
                }
                const _path = `${path.resolve()}/public/shapfile/`
                if (!fs.existsSync(_path)) {
                    fs.mkdirSync(_path);
                }

                const dest = `public/shapfile/shapfile-${uuid4}.zip`
                const url = `${config.SERVICE_HOST}/shapfile/shapfile-${uuid4}.zip`;
                // await download(url, dest);
                await convert(shape.features, dest, options);
                result(res, url);
            }

            if (type === 'kml') {
                const data = await convertKml(shape);
                res.setHeader("Content-Type", "text/kml; charset=utf-8");
                res.setHeader(`Content-Disposition`, `attachment; filename=${uuid4}.kml`);
                res.status(200).end(data);

            }

            if (type === 'kmz') {
                const { data } = await convertKmz.fromGeoJson(shape);
                res.setHeader("Content-Type", "text/kmz; charset=utf-8");
                res.setHeader(`Content-Disposition`, `attachment; filename=${uuid4}.kmz`);
                res.status(200).end(data);

            }

            if (type === 'csv') {
                const url = `${config.SERVICE_HOST}/shp/convertGeoToShp?id=${id}&type=${type}`
                const csvFields = [], data = []
                shape.features.forEach(e => {
                    data.push(e.properties)
                });
                const keys = data.map(key => Object.keys(key));
                keys.forEach(valKey => {
                    valKey.forEach(e => {
                        const index = csvFields.findIndex(ind => ind == e);
                        if (index === -1) csvFields.push(e);
                    })
                })
                const csvParser = new CsvParser({ csvFields, withBOM: true });
                const resCsvData = csvParser.parse(data);
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader(`Content-Disposition`, `attachment; filename=${uuid4}.csv`);
                res.status(200).end(resCsvData);

            }
            if (type === 'xls') {

                const wb = new xl.Workbook();
                const ws = wb.addWorksheet('Worksheet Name');

                const headingColumnNames = [], data = []
                shape.features.forEach(e => {
                    data.push(e.properties)
                });
                const keys = data.map(key => Object.keys(key));
                keys.forEach(valKey => {
                    valKey.forEach(e => {
                        const index = headingColumnNames.findIndex(ind => ind == e);
                        if (index === -1) headingColumnNames.push(e);
                    })
                })

                let headingColumnIndex = 1;
                headingColumnNames.forEach(heading => {
                    ws.cell(1, headingColumnIndex++)
                        .string(heading)
                });

                let rowIndex = 2;
                data.forEach(record => {
                    let columnIndex = 1;
                    Object.keys(record).forEach(columnName => {
                        ws.cell(rowIndex, columnIndex++)
                            .string(record[columnName])
                    });
                    rowIndex++;
                });
                const excute = `${uuid4}.xlsx`
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8");
                res.setHeader(`Content-Disposition`, `attachment; filename=${excute}`);
                wb.write(excute, res);
            }
        }


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

        const { search, project_name, prov, amp, tam, layer_group } = req.query
        const _res_sql = await getAllShapeDataService(search, project_name, prov, amp, tam, layer_group)
        _res_sql.arr_sql.forEach(e => { e.geom = undefined })
        const amount_data = (_res_sql.amount.length > 0) ? _res_sql.amount.reduce((sum, num) => Number(sum) + Number(num)) : 0

        result(res, {
            data: _res_sql.arr_sql,
            amount_data
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
        const { search, project_name, prov, amp, tam, layer_group } = req.query
        const _res_sql = await getFromProjectService(search, project_name, prov, amp, tam, layer_group);
        const { _temp, ___temp } = _res_sql
        const status = [], data = [], _status = [], _data = [], status_color = []

        _temp.forEach(e => {
            status.push(e.name)
            data.push(e.count)
            status_color.push(e.status_color)
        })
        ___temp.forEach(e => {
            _status.push(e.name)
            _data.push(e.row_distan)
        })

        result(res, {
            plot: { status, data },
            distance: { status: _status, data: _data },
            status_color
        })
    } catch (error) {
        next(error);
    }
}

exports.getFromReportDashbord = async (req, res, next) => {
    try {
        const { search, project_name, prov, amp, tam, layer_group } = req.query
        const _data = await getReportDashboardService(search, project_name, prov, amp, tam, layer_group);

        const _provList = [], _ampList = [], _tamList = [], _status = []
        _data.forEach(e => {

            e.prov = e.prov.replace(/\n/g, "")
            e.amp = e.amp.replace(/\n/g, "")
            e.tam = e.tam.replace(/\n/g, "")
            e.row_distan = Number(e.row_distan)
            if (e.prov && e.amp && e.tam) {

                const indexProv = _provList.findIndex(x => x.prov === e.prov);
                if (indexProv === -1) _provList.push(e);

                const indexAmp = _ampList.findIndex(x => x.amp === e.amp);
                if (indexAmp === -1) _ampList.push(e);

                const indexTam = _tamList.findIndex(x => x.tam === e.tam);
                if (indexTam === -1) _tamList.push(e);

                const indexStatus = _status.findIndex(x => x.id === e.status_code);
                if (indexStatus === -1) _status.push({
                    id: e.status_code,
                    status: e.name,
                    color: e.status_color,
                });
            }

        });

        const _model = {
            table: _status,
            data: {
                all: []
            },
        }


        /* All */
        _provList.forEach((e, index) => {
            e.id = index + 1
            const _provAll = _data.filter(x => (x.prov.replace(/\n/g, "") == e.prov))
            const _ampFilter = _ampList.filter(x => (x.prov.replace(/\n/g, "") == e.prov))
            const _distance = _provAll.reduce((a, b) => {
                return { row_distan: a.row_distan + b.row_distan }
            }).row_distan

            _model.data.all.push({
                prov_id: e.id,
                prov_name: e.prov,
                plot: _provAll.length,
                distance: (Math.round((Math.round(_distance * 100.0 / 100.0) / 1000) * 100) / 100),

                amp_list: _ampFilter.map(x => {
                    const _ampAll = _data.filter(a => (a.amp.replace(/\n/g, "") == x.amp))
                    const _tamFilter = _tamList.filter(a => (a.amp.replace(/\n/g, "") == x.amp))
                    const _distance = _ampAll.reduce((a, b) => {
                        return { row_distan: a.row_distan + b.row_distan }
                    }).row_distan

                    return {
                        amp_name: x.amp,
                        plot: _ampAll.length,
                        distance: (Math.round((Math.round(_distance * 100.0 / 100.0) / 1000) * 100) / 100),

                        
                        tam_list: _tamFilter.map(y => {
                            const _tamAll = _data.filter(a => (a.tam.replace(/\n/g, "") == y.tam))
                            const _distance = _tamAll.reduce((a, b) => {
                                return { row_distan: a.row_distan + b.row_distan }
                            }).row_distan
                            return {
                                tam_name: y.tam,
                                plot: _tamAll.length,
                                distance: (Math.round((Math.round(_distance * 100.0 / 100.0) / 1000) * 100) / 100)
                            }
                        })
                    }

                })
            })
        });

        _status.forEach(item => {
            const name_obj = `status_${item.id}`;
            _model.data[name_obj] = []
            /* Lool */
            const _provListStatus = [], _ampListStatus = [], _tamListStatus = []
            _data.forEach(e => {
                if (e.status_code == item.id) {

                    e.prov = e.prov.replace(/\n/g, "")
                    e.amp = e.amp.replace(/\n/g, "")
                    e.tam = e.tam.replace(/\n/g, "")
                    e.row_distan = Number(e.row_distan)
                    if (e.prov && e.amp && e.tam) {

                        const indexProv = _provListStatus.findIndex(x => x.prov === e.prov);
                        if (indexProv === -1) _provListStatus.push(e);

                        const indexAmp = _ampListStatus.findIndex(x => x.amp === e.amp);
                        if (indexAmp === -1) _ampListStatus.push(e);

                        const indexTam = _tamListStatus.findIndex(x => x.tam === e.tam);
                        if (indexTam === -1) _tamListStatus.push(e);

                    }
                }

            });

            _provListStatus.forEach((e, index) => {
                e.id = index + 1
                const _provAll = _data.filter(x => (x.prov.replace(/\n/g, "") == e.prov && x.status_code == item.id))
                const _ampFilter = _ampListStatus.filter(x => (x.prov.replace(/\n/g, "") == e.prov))
                const _distance = _provAll.reduce((a, b) => {
                    return { row_distan: a.row_distan + b.row_distan }
                }).row_distan
                _model.data[name_obj].push({
                    status_id: item.id,
                    prov_id: e.id,
                    prov_name: e.prov,
                    plot: _provAll.length,
                    distance: (Math.round((Math.round(_distance * 100.0 / 100.0) / 1000) * 100) / 100),

                    amp_list: _ampFilter.map(x => {
                        const _ampAll = _data.filter(a => (a.amp.replace(/\n/g, "") == x.amp && a.status_code == item.id))
                        const _tamFilter = _tamListStatus.filter(a => (a.amp.replace(/\n/g, "") == x.amp))
                        const _distance = _ampAll.reduce((a, b) => {
                            return { row_distan: a.row_distan + b.row_distan }
                        }).row_distan
                        return {
                            amp_name: x.amp,
                            plot: _ampAll.length,
                            distance: (Math.round((Math.round(_distance * 100.0 / 100.0) / 1000) * 100) / 100),
                            tam_list: _tamFilter.map(y => {
                                const _tamAll = _data.filter(a => (a.tam.replace(/\n/g, "") == y.tam) && a.status_code == item.id)
                                const _distance = _tamAll.reduce((a, b) => {
                                    return { row_distan: a.row_distan + b.row_distan }
                                }).row_distan
                                return {
                                    tam_name: y.tam,
                                    plot: _tamAll.length,
                                    distance: (Math.round((Math.round(_distance * 100.0 / 100.0) / 1000) * 100) / 100)
                                }
                            })
                        }

                    })
                })
            });

            _model.data[name_obj].sort((a, b) => {
                return a.prov_id - b.prov_id
            })
        });
        _model.data["all"].sort((a, b) => {
            return a.prov_id - b.prov_id
        })


        result(res, _model)

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
        if (_type === "shape file" || _type === "kml" || _type === "kmz") {
            const msg = { message: "อัพโหลดไฟล์ไม่ถูกต้อง" }
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

const download = (url, dest, cb) => {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, (response) => {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });

    return request
};








