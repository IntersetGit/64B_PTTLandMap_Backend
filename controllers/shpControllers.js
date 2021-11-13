const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("@timedata/geojson2shp-utf8");
const { addShapeService, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService, addShapeLayersService, addkmlLayersService } = require('../service/shape_layers')
const { findIdLayersShape, createTableShapeService, getAllShapeDataService, getShapeProvinceMapService, searchDataShapeProvAmpTamMapService,
    editshapeDataService, getFromProjectService, getFromReportDashbordService, getFromReportDashbordServiceEach } = require('../service/shape_data')
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
const json2xls = require('json2xls');
const CsvParser = require("json2csv").Parser;
const { errorUserNot } = require("../messages");
const http = require('http');



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
            const option_layer = req.body.option_layer ? JSON.parse(req.body.option_layer) : {}
            const { color, group_layer_id, name_layer, type } = req.query
            const { sysm_id } = req.user
            const id = uuid.v4();
            const mimetype = `${file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase().toLowerCase()}`;

            if (mimetype == 'zip') {

                const geojson = await shp(file.data); // แปลงไฟล์ shape
                console.log(geojson);
                const _createTableShape = await createTableShapeService(geojson, queryInterface, mimetype);
                // console.log(_createTableShape);

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
        next(error);
    }
}



exports.convertGeoToKml = async (req, res, next) => {
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
                await convert(shape.features, dest , options);
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
        const _res = await getFromReportDashbordService(search, project_name, prov, amp, tam, layer_group)
        const _sumPotArea = await getFromReportDashbordServiceEach(search, project_name, prov, amp, tam, layer_group)


        // araea_all.forEach((e) => {
        //     e.row_distan = Number(e.row_distan)
        //     const int = ___temp.findIndex((n) => n.name === e.name)
        //     if (int === -1) {
        //       ___temp.push(e);
        //     } else {
        //       ___temp[int].row_distan += e.row_distan;
        //     }
        //   })


        let PATM = _res._prov.map(e => {
            // const _find = _res._temp.find(x => x.)
            let _Potprov = 0
            let _Areaprov = 0
            let statusAreaP1 = 0
            let statusAreaP2 = 0
            let statusAreaP3 = 0
            let statusAreaP4 = 0
            let statusAreaP5 = 0
            let statusPotP1 = 0
            let statusPotP2 = 0
            let statusPotP3 = 0
            let statusPotP4 = 0
            let statusPotP5 = 0

            _sumPotArea.Sumpottam.forEach(p => {
                if (p.prov == e.name) {
                    _Potprov += p.count
                    if (p.status == 1) {
                        statusPotP1 += p.count
                    } else if (p.status == 2) {
                        statusPotP2 += p.count
                    } else if (p.status == 3) {
                        statusPotP3 += p.count
                    } else if (p.status == 4) {
                        statusPotP4 += p.count
                    } else if (p.status == 5) {
                        statusPotP5 += p.count
                    }
                }
            })
            _sumPotArea.Sumareatam.forEach(a => {
                if (a.prov == e.name) {
                    a.row_distan = Number(a.row_distan)
                    a.row_distan = (Math.round(a.row_distan * 100)) / 100
                    _Areaprov += a.row_distan
                    if (a.status == 1) {
                        statusAreaP1 += a.row_distan
                    } else if (a.status == 2) {
                        statusAreaP2 += a.row_distan
                    } else if (a.status == 3) {
                        statusAreaP3 += a.row_distan
                    } else if (a.status == 4) {
                        statusAreaP4 += a.row_distan
                    } else if (a.status == 5) {
                        statusAreaP5 += a.row_distan
                    }
                }
            })

            return {
                id: e.id,
                prov_name: e.name,
                sum_pot: _Potprov,
                sum_area: _Areaprov,
                Area_status_1: statusAreaP1,
                Area_status_2: statusAreaP2,
                Area_status_3: statusAreaP3,
                Area_status_4: statusAreaP4,
                Area_status_5: statusAreaP5,
                Pot_status_1: statusPotP1,
                Pot_status_2: statusPotP2,
                Pot_status_3: statusPotP3,
                Pot_status_4: statusPotP4,
                Pot_status_5: statusPotP5,
                // statusarea1: status,
                amp: []
            }
        })
        PATM.forEach(e => {
            _res._amp.forEach(a => {
                if (e.id == a.prov_id) {

                    let _Potamp = 0
                    let _Areaamp = 0
                    let statusAreaA1 = 0
                    let statusAreaA2 = 0
                    let statusAreaA3 = 0
                    let statusAreaA4 = 0
                    let statusAreaA5 = 0
                    let statusPotA1 = 0
                    let statusPotA2 = 0
                    let statusPotA3 = 0
                    let statusPotA4 = 0
                    let statusPotA5 = 0
                    _sumPotArea.Sumpottam.forEach(pa => {
                        if (pa.amp == a.name) {
                            _Potamp += pa.count
                            if (pa.status == 1) {
                                statusPotA1 += pa.count
                            } else if (pa.status == 2) {
                                statusPotA2 += pa.count
                            } else if (pa.status == 3) {
                                statusPotA3 += pa.count
                            } else if (pa.status == 4) {
                                statusPotA4 += pa.count
                            } else if (pa.status == 5) {
                                statusPotA5 += pa.count
                            }
                        }
                    })
                    _sumPotArea.Sumareatam.forEach(aa => {
                        if (aa.amp == a.name) {
                            aa.row_distan = Number(aa.row_distan)
                            aa.row_distan = (Math.round(aa.row_distan * 100)) / 100
                            _Areaamp += aa.row_distan
                            if (aa.status == 1) {
                                statusAreaA1 += aa.row_distan
                            } else if (aa.status == 2) {
                                statusAreaA2 += aa.row_distan
                            } else if (aa.status == 3) {
                                statusAreaA3 += aa.row_distan
                            } else if (aa.status == 4) {
                                statusAreaA4 += aa.row_distan
                            } else if (aa.status == 5) {
                                statusAreaA5 += aa.row_distan
                            }
                        }
                    })

                    e.amp.push({
                        id: a.id,
                        amp_name: a.name,
                        sum_pot: _Potamp,
                        sum_area: _Areaamp,
                        Area_status_1: statusAreaA1,
                        Area_status_2: statusAreaA2,
                        Area_status_3: statusAreaA3,
                        Area_status_4: statusAreaA4,
                        Area_status_5: statusAreaA5,
                        Pot_status_1: statusPotA1,
                        Pot_status_2: statusPotA2,
                        Pot_status_3: statusPotA3,
                        Pot_status_4: statusPotA4,
                        Pot_status_5: statusPotA5,
                        tam: []
                    })
                }
            })
        })
        PATM.forEach(e => {
            _res._tam.forEach(t => {
                const _find = e.amp.find(m => m.id == t.amp_id)
                if (_find) {

                    let _Pottam = 0
                    let _Areatam = 0
                    let statusAreaT1 = 0
                    let statusAreaT2 = 0
                    let statusAreaT3 = 0
                    let statusAreaT4 = 0
                    let statusAreaT5 = 0
                    let statusPotT1 = 0
                    let statusPotT2 = 0
                    let statusPotT3 = 0
                    let statusPotT4 = 0
                    let statusPotT5 = 0

                    _sumPotArea.Sumpottam.forEach(pt => {
                        if (pt.tam == t.name) {
                            _Pottam += pt.count

                            if (pt.status == 1) {
                                statusPotT1 += pt.count
                            } else if (pt.status == 2) {
                                statusPotT2 += pt.count
                            } else if (pt.status == 3) {
                                statusPotT3 += pt.count
                            } else if (pt.status == 4) {
                                statusPotT4 += pt.count
                            } else if (pt.status == 5) {
                                statusPotT5 += pt.count
                            }
                        }
                    })
                    _sumPotArea.Sumareatam.forEach(at => {
                        if (at.tam == t.name) {
                            at.row_distan = Number(at.row_distan)
                            at.row_distan = (Math.round(at.row_distan * 100)) / 100
                            _Areatam += at.row_distan
                            if (at.status == 1) {
                                statusAreaT1 += at.row_distan
                            } else if (at.status == 2) {
                                statusAreaT2 += at.row_distan
                            } else if (at.status == 3) {
                                statusAreaT3 += at.row_distan
                            } else if (at.status == 4) {
                                statusAreaT4 += at.row_distan
                            } else if (at.status == 5) {
                                statusAreaT5 += at.row_distan
                            }
                        }
                    })

                    _find.tam.push({
                        id: t.id,
                        tam_name: t.name,
                        sum_pot: _Pottam,
                        sum_area: _Areatam,
                        Area_status_1: statusAreaT1,
                        Area_status_2: statusAreaT2,
                        Area_status_3: statusAreaT3,
                        Area_status_4: statusAreaT4,
                        Area_status_5: statusAreaT5,
                        Pot_status_1: statusPotT1,
                        Pot_status_2: statusPotT2,
                        Pot_status_3: statusPotT3,
                        Pot_status_4: statusPotT4,
                        Pot_status_5: statusPotT5,
                    })
                }
            })
        })



        result(res, { PATM })
        // result(res, {_sumPotArea})



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
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });

    return request
};








