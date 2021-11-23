const models = require("../models");
const {
  sequelizeString,
  sequelizeStringFindOne,
  stringToSnakeCase,
} = require("../util");
const uuid = require("uuid");
const { DataTypes } = require("sequelize"); //type Database
const { SequelizeAuto } = require("sequelize-auto");
const sequelize = require("../config/dbConfig"); //connect database
const lodash = require("lodash");

//ค้นหาชื่อตารางทั้งหมดใน shape_data
const func_table_name = async () => {
  return await sequelizeString(`  
    SELECT * FROM information_schema.tables
    WHERE table_schema = 'shape_data' `);
};

exports.shapeDataService = async (table_name, id, type) => {

  const filter_table_name = await models.mas_layers_shape.findOne({ where: { table_name } })
  let str_type = ``
  if (type == 'shape file') str_type = `shape_data`
  if (type == 'kml') str_type = `kml_data`
  if (type == 'kmz') str_type = `kmz_data`
  if (type == 'wms') {
    const err = new Error('ไฟล์เป็น wms')
    err.statusCode = 400
    throw err
  }
  if (type == null || type == '') {
    if (filter_table_name.type == 'shape file') str_type = `shape_data`
    if (filter_table_name.type == 'kml') str_type = `kml_data`
    if (filter_table_name.type == 'kmz') str_type = `kmz_data`
  }

  if (filter_table_name || filter_table_name.table_name != '' && filter_table_name.table_name != null) {

    let sql = `  
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type',       'Feature',
                    'id',         gid,
                    'geometry',   ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom,4326), 4326))::json,
                    'properties', to_jsonb(row) - 'gid' - 'geom'))) AS shape `

    if (id) sql += ` FROM  (SELECT * FROM ${str_type}.${table_name} WHERE gid = ${id}) row`
    else sql += ` FROM  (SELECT * FROM ${str_type}.${table_name}) row `

    let result_sql = await sequelizeStringFindOne(sql);
    /* ค้นหาสีตาม status ใน shpae*/
    if (result_sql.shape.features != null) {
      if (filter_table_name.config_color === true) return result_sql
      else {
        for (let i = 0; i < result_sql.shape.features.length; i++) {
          const e = result_sql.shape.features[i];
          if (e.properties.status) {
            const _status_shape = String(e.properties.status)
            const { status_color } = await models.mas_status_project.findOne({ where: { status_code: _status_shape } })
            e.properties.status_color = status_color ?? undefined
          }

        }
      }

    } else {
      const err = new Error('ไม่มีข้อมูล shape')
      err.statusCode = 404
      throw err
    }

    return result_sql

  } else[];
};

exports.findIdLayersShape = async (id) => {
  return await models.mas_layers_shape.findByPk(id);
};

exports.createTableShapeService = async (geojson, queryInterface, mimetype) => {
  var obj = {}
  var obj1 = {}
  var schema = ``, type_geo

  /* หาประเภท type Geo และเปลี่ยนชื่อ type Geo*/
  let typeGeo = []

  if (mimetype == 'zip') {
    geojson.features.forEach(setT => {
      if (setT.geometry.bbox && setT.geometry.bbox.length > 3 && setT.geometry.coordinates && setT.geometry.coordinates.length >= 1 && setT.geometry.type == 'Polygon') {
        setT.geometry.type = 'MultiPolygon'
      }

      if (setT.geometry.bbox && setT.geometry.bbox.length > 3 && setT.geometry.coordinates && setT.geometry.coordinates.length >= 1 && setT.geometry.type == 'MultiLineString') {
        setT.geometry.type = 'MultiLineString'
      }

      if (setT.geometry.coordinates.length >= 2 && setT.geometry.type == 'Point') {
        setT.geometry.type = 'Point'
      }
    });
  } else if (mimetype == 'kml') {
    geojson.features.forEach(setK => {
      if (setK.geometry.coordinates && setK.geometry.coordinates.length >= 1 && setK.geometry.type == 'Polygon') {
        if (setK.geometry.coordinates[0][0].length >= 3) setK.geometry.type = 'PolygonZ'
      }
      if (setK.geometry.coordinates.length <= 2 && setK.geometry.type == 'Point') {
        setK.geometry.type = 'Point'
      }
      if (setK.geometry.coordinates.length >= 3 && setK.geometry.type == 'Point') {
        setK.geometry.type = 'PointZ'
      }
    })

  } else {
    geojson.features.forEach(setZ => {
      if (setZ.geometry.coordinates.length >= 1 && setZ.geometry.coordinates[0].length >= 2 && setZ.geometry.type == 'LineString') {
        setZ.geometry.type = 'LineString'
      }

      if (setZ.geometry.coordinates.length >= 1 && setZ.geometry.coordinates[0].length >= 3 && setZ.geometry.type == 'LineString') {
        setZ.geometry.type = 'LineStringZ'
      }

      if (setZ.geometry.coordinates.length >= 3 && setZ.geometry.type == 'Point') {
        setZ.geometry.type = 'PointZ'
      }

      if (setZ.geometry.coordinates.length >= 1 && setZ.geometry.type == 'Polygon') {
        if (setZ.geometry.coordinates[0][0].length >= 3) setZ.geometry.type = 'PolygonZ'
      }

    })
  }

  const typeGeometry = geojson.features.map(tp => tp.geometry.type);
  typeGeometry.forEach(e => {
    const index = typeGeo.findIndex(dex => dex.toLowerCase() == e.toLowerCase());
    if (index === -1) {
      typeGeo.push(e)
    }
  })


  /* ใช้ key เป็น table */
  const arrPropertie = []
  geojson.features.forEach(e => {
    obj.newObject = Object.keys(e.properties); //เอาชื่อตัวแปรมาใช้
    obj.newObject = obj.newObject.map((e) => e.toLowerCase());
    obj.newObject = obj.newObject.map((str) => stringToSnakeCase(str)); //แปลงเป็น SnakeCase
    arrPropertie.push(obj.newObject)
  })

  let indexPropertie = []
  arrPropertie.forEach(e => {
    const index2 = indexPropertie.findIndex(dex => dex.length === e.length)
    if (index2 === -1) {
      indexPropertie.push(e)
    }
  })

  var dataType, arrNameTable = []
  for (let i = 0; i < indexPropertie.length; i++) {
    const colomn = indexPropertie[i];
    const typeGeo_ = [typeGeo[typeGeo.length - 1]]

    for (let a = 0; a < typeGeo_.length; a++) {
      const e = typeGeo_[a];

      if (e === 'MultiPolygon') dataType = DataTypes.GEOMETRY("MultiPolygon", 0)
      if (e === 'Point') dataType = DataTypes.GEOMETRY("Point", 0)
      if (e === 'PointZ') dataType = DataTypes.GEOMETRY("PointZ", 0)
      if (e === 'LineString') dataType = DataTypes.GEOMETRY("LineString", 0)
      if (e === 'LineStringZ') dataType = DataTypes.GEOMETRY("LineStringZ", 0)
      if (e === 'MultiLineString') dataType = DataTypes.GEOMETRY("MultiLineString", 0)
      if (e === 'Polygon') dataType = DataTypes.GEOMETRY("Polygon", 4326)
      if (e === 'PolygonZ') dataType = DataTypes.GEOMETRY("PolygonZ", 4326)

      if (indexPropertie.length > 0) {
        obj1.gid = {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: true,
        }
        obj1.geom = {
          type: dataType,
          allowNull: true,
        }

        colomn.forEach(keys => {
          obj1[keys] = {
            type: DataTypes.STRING,
            allowNull: true,
          }
        })

        obj1.objectid = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.prov = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.amp = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.tam = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.project_na = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.parlabel1 = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.row_distan = {
          type: DataTypes.STRING,
          allowNull: true,
        }
        obj1.status = {
          type: DataTypes.STRING,
          allowNull: true,
        }

      } else {
        const err = new Error("ผิดพลาดไม่สามารถสร้างฐานข้อมูลได้");
        err.statusCode = 400;
        throw err;
      }

      switch (mimetype) {
        case "zip":
          obj.nameTable = `ptt_shape_number${Math.floor((Math.random() * 100000) * 2)}`
          schema = `shape_data`
          break;
        case "kml":
          obj.nameTable = `ptt_kml_number${Math.floor((Math.random() * 100000) * 2)}`
          schema = `kml_data`
          break;
        case "kmz":
          obj.nameTable = `ptt_kmz_number${Math.floor((Math.random() * 100000) * 2)}`
          schema = `kmz_data`
          break;
        default:
          break;
      }

      arrNameTable.push(obj.nameTable)
      await queryInterface.createTable(`${obj.nameTable}`, obj1, { schema })
    }
  }

  return {
    arrNameTable,
    indexPropertie,
    schema,
  }

  // const arrPropertie = [],
  //   typeData = [],
  //   table_key = ["prov", "amp", "tam", "project_na", "parlabel1", "row_distan", "objectid"],
  //   _type_geo = ["Polygon", "Point", "LineString", "MultiLineString"]

  // //ตรวจสอบประเภท type geo
  // geojson.features.forEach((e) => {
  //   const geometryType = _type_geo.find(ty => ty === e.geometry.type)
  //   if (geometryType) type_geo = geometryType
  // });

  // //key เป็นชื่อตาราง
  // geojson.features.forEach(e => {
  //   obj.newObject = Object.keys(e.properties); //เอาชื่อตัวแปรมาใช้
  //   obj.newObject = obj.newObject.map((e) => e.toLowerCase());
  //   obj.newObject = obj.newObject.map((str) => stringToSnakeCase(str)); //แปลงเป็น SnakeCase
  //   arrPropertie.push(obj.newObject)
  // })

  // const arrayMax = Function.prototype.apply.bind(Math.max, null);
  // const _tempppp = arrPropertie.map(e => e.length)
  // var max = arrayMax(_tempppp);
  // const _index = _tempppp.findIndex(x => x == max)
  // let newArrPropertie
  // if (_index != -1) newArrPropertie = arrPropertie[_index]

  // let _dataType
  // if (type_geo === 'Polygon') _dataType = DataTypes.GEOMETRY("MultiPolygon", 0)
  // else if (type_geo === 'Point') _dataType = DataTypes.GEOMETRY("Point", 0)
  // else if (type_geo === 'MultiLineString') _dataType = DataTypes.GEOMETRY("MultiLineString", 0)
  // else _dataType = DataTypes.GEOMETRY("LineStringZ", 4326)

  // if (newArrPropertie.length > 0) {
  //   (obj1.gid = {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //     allowNull: true,
  //   }),
  //     (obj1.geom = {
  //       type: _dataType,
  //       allowNull: true,
  //     });
  //   newArrPropertie.forEach((colomn) => {
  //     /* loop ใส่ type*/
  //     const keys = table_key.find((key) => key == colomn);
  //     if (keys) {
  //       obj1[colomn] = {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       };
  //     } else {
  //       (obj1[colomn] = {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       }),
  //         (obj1.objectid = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.prov = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.amp = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.tam = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.project_na = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.parlabel1 = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.row_distan = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         }),
  //         (obj1.status = {
  //           type: DataTypes.STRING,
  //           allowNull: true,
  //         })
  //     }
  //   });
  // } else {
  //   const err = new Error("ผิดพลาดไม่สามารถสร้างฐานข้อมูลได้");
  //   err.statusCode = 400;
  //   throw err;
  // }

  // await queryInterface.createTable(`${obj.nameTable}`, obj1, { schema });

  // // const auto = new SequelizeAuto(sequelize, null, null, {
  // //     caseFile: 'o',
  // //     caseModel: 'o',
  // //     caseProp: 'o'
  // // })
  // // auto.run();

};

/* เรียกข้อมูลทั้งหมด shape_data */

exports.getAllShapeDataService = async (
  search,
  project_name,
  prov,
  amp,
  tam,
  layer_group
) => {
  const table_name = await func_table_name();
  const KeepData = [],
    arr_sql = [],
    amount = [];
  var sql,
    _res,
    sql_count,
    val_sql = ``,
    fromsql

  if (search) val_sql += ` AND ${project_name} ILIKE '%${search}%' `
  if (prov) val_sql += ` AND prov = '${prov}' `
  if (amp) val_sql += ` AND amp = '${amp}' `
  if (tam) val_sql += ` AND tam = '${tam}' `

  if (layer_group) {

    _res = await models.mas_layers_shape.findByPk(layer_group);
    fromsql = `${_res.table_name}`

    sql = await sequelizeString(
      `SELECT * FROM shape_data.${fromsql} WHERE gid IS NOT NULL ${val_sql} GROUP BY gid`
    );
    sql_count = await sequelizeStringFindOne(
      `SELECT COUNT(*) AS amount_data FROM shape_data.${fromsql} WHERE gid IS NOT NULL ${val_sql} `
    );

    amount.push(sql_count.amount_data);
    sql.forEach((e) => {
      if (e.partype === "โฉนดที่ดิน" || e.partype === "น.ส.4") e.color = "#FF0000" //แดง
      else if (e.partype === "น.ส.3ก.") e.color = "#049B06"; //เขียว
      else if (e.partype === "น.ส.3" || e.partype === "น.ส.3ข.") e.color = "#000000"; //ดำ
      else if (e.partype === "สปก.4-01") e.color = "#0115C3" //ฟ้า
      else e.color = "#626262"; //เทา

      e.table_name = table_name.table_name;
      arr_sql.push(e);
    });

  } else {
    for (let a = 0; a < table_name.length; a++) {
      const tables = table_name[a];

      sql = await sequelizeString(
        `SELECT * FROM shape_data.${tables.table_name} WHERE gid IS NOT NULL ${val_sql} GROUP BY gid`
      );

      sql_count = await sequelizeStringFindOne(
        `SELECT COUNT(*) AS amount_data FROM shape_data.${tables.table_name} WHERE gid IS NOT NULL ${val_sql} `
      );

      amount.push(sql_count.amount_data);
      sql.forEach((e) => {
        if (e.partype === "โฉนดที่ดิน" || e.partype === "น.ส.4")
          e.color = "#FF0000";
        //แดง
        else if (e.partype === "น.ส.3ก.") e.color = "#049B06";
        //เขียว
        else if (e.partype === "น.ส.3" || e.partype === "น.ส.3ข.")
          e.color = "#000000";
        //ดำ
        else if (e.partype === "สปก.4-01") e.color = "#0115C3";
        //ฟ้า
        else e.color = "#626262"; //เทา

        e.table_name = tables.table_name;
        arr_sql.push(e);
      });
    }
  }

  return { arr_sql, amount };
};

/* เรียกจังหวัด อำเภอตำบล ตามข้อมูลที่มีใน mas_layers_shape */
exports.getShapeProvinceMapService = async (layer_group, layer_shape) => {
  const KeepData = [],
    arr_sql = [];
  var sql, _res;

  if (layer_group) {
    const allSchema = await sequelizeString(`SELECT * FROM information_schema.tables`)
    const layers_data = await models.mas_layers_shape.findAll({
      where: { group_layer_id: layer_group },
    });
    if (layers_data.length > 0) {
      layers_data.forEach((e) => [KeepData.push(e.table_name)]);
    } else[];

    for (const af in KeepData) {
      if (Object.hasOwnProperty.call(KeepData, af)) {
        const tables_name = KeepData[af];
        if (tables_name != "" && tables_name != null) {
          const { table_schema, table_name } = allSchema.find(tbl => tbl.table_name == tables_name)
          _res = await sequelizeString(
            (sql = `SELECT * FROM ${table_schema}.${table_name}  `)
          );
          if (_res.length > 0) {
            _res.forEach((province) => {
              const { prov, amp, tam } = province;
              arr_sql.push({ prov, amp, tam });
            });
          }
        }
      }
    }
  }

  if (layer_shape) {
    const layers_data_shape = await models.mas_layers_shape.findOne({
      where: { id: layer_shape },
    });
    _res = await sequelizeString(
      (sql = `SELECT * FROM shape_data.${layers_data_shape.table_name} `)
    );
    if (_res.length > 0) {
      _res.forEach((province) => {
        const { prov, amp, tam } = province;
        arr_sql.push({ prov, amp, tam });
      });
    }
  }




  // [...new Set(arr_sql.map(({prov}) => prov.replace(/\n/g, '') ))],
  // [...new Set(arr_sql.map(({amp}) => amp.replace(/\n/g, '') ))],
  // [...new Set(arr_sql.map(({tam}) => tam.replace(/\n/g, '') ))]

  const prov = [],
    amp = [],
    tam = [];
  arr_sql.forEach((e, i) => {
    if (e.prov || e.amp || e.tam) {
      const i1 = prov.findIndex((x) => x.name === e.prov.replace(/\n/g, ""));
      if (i1 === -1 && e.prov) {
        prov.push({
          id: i + 1,
          name: e.prov.replace(/\n/g, ""),
        });
      }

      const i2 = amp.findIndex((x) => x.name === e.amp.replace(/\n/g, ""));
      if (i2 === -1 && e.amp) {
        amp.push({
          id: i + 1,
          prov_id:
            prov[prov.findIndex((x) => x.name === e.prov.replace(/\n/g, ""))]
              .id,
          name: e.amp.replace(/\n/g, ""),
        });
      }

      const i3 = tam.findIndex((x) => x.name === e.tam.replace(/\n/g, ""));
      if (i3 === -1 && e.tam) {
        tam.push({
          id: i + 1,
          amp_id:
            amp[amp.findIndex((x) => x.name === e.amp.replace(/\n/g, ""))].id,
          name: e.tam.replace(/\n/g, ""),
        });
      }
    } else[];
  });

  return {
    prov,
    amp,
    tam,
  };
};

/* ค้นหา จังหวัด อำเภอ ตำบล */
exports.searchDataShapeProvAmpTamMapService = async (prov, amp, tam) => {
  const table_name = await func_table_name();
  const KeepData = [],
    arr_sql = [];
  var sql, _res;

  if (table_name.length > 0) {
    for (const key in table_name) {
      if (Object.hasOwnProperty.call(table_name, key)) {
        const tables = table_name[key];
        if (prov) {
          var wheresql = "";
          if (amp) {
            wheresql += ` and amp = '${amp}' `;
          }
          if (tam) {
            wheresql += ` and tam = '${tam}' `;
          }
          sql = await sequelizeString(
            ` SELECT * FROM shape_data.${tables.table_name} WHERE prov = '${prov}' ${wheresql} `
          );

          sql.forEach((provs) => {
            provs.table_name = tables.table_name;
            arr_sql.push(provs);
          });
        }
      }
    }
  }

  return arr_sql.length > 0 ? arr_sql : [];
};

/* แก้ไขข้อมูล shape */
exports.editshapeDataService = async (model) => {
  const filter_shapedata = await models.mas_layers_shape.findOne({
    where: { table_name: model.table_name },
  });

  if (!filter_shapedata) {
    const err = new Error("ไม่พบชั้นข้อมูล");
    err.statusCode = 404;
    throw err;
  }
  var str_sql = `UPDATE shape_data.${filter_shapedata.table_name} SET `;
  var _format = ``,
    newKey = [];

  for (const key in model) {
    if (key !== "table_name" && key !== "id") {
      newKey.push(` ${key} = '${model[key]}' `);
    }
  }
  str_sql += newKey.toString();
  str_sql += ` WHERE gid = ${model.gid}`;
  return await sequelizeString(str_sql);
};

/** ส่งมอบสิทธื์โครงการ
 * เรียกข้อมูลสิทธิ์
 */

exports.getFromProjectService = async (search, project_name, prov, amp, tam, layer_group) => {
  const table_name = await func_table_name();
  const KeepData = [], arr_sql = [], araea_all = [];
  var sql, sql1, _res, val_sql = ``

  if (search) project_name == "objectid" ? val_sql = ` AND ${project_name} = ${search} ` : val_sql = ` AND ${project_name} ILIKE '%${search}%' `
  if (prov) val_sql += ` AND prov = '${prov}' `;
  if (amp) val_sql += ` AND amp = '${amp}' `;
  if (tam) val_sql += ` AND tam = '${tam}' `;

  const status_shape = await models.mas_status_project.findAll({ order: [["sort", "ASC"]] });
  if (layer_group) {
    _res = await models.mas_layers_shape.findByPk(layer_group);
    for (const clor in status_shape) {
      if (Object.hasOwnProperty.call(status_shape, clor)) {
        const statues = status_shape[clor];
        sql = await sequelizeString(`SELECT COUNT(*)  FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql} `);
        sql.forEach(({ count }) => {
          arr_sql.push({
            count,
            table_name: _res.table_name,
            name: statues.name,
            status: statues.status_code,
            status_color: statues.status_color
          });
        });

        //หาระยะทาง
        sql1 = await sequelizeString(`SELECT row_distan, status FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
        if (sql1.length > 0) {

          sql1.forEach(({ row_distan }) => {
            row_distan = (Math.round((Number(row_distan) * 100.0) / 100.0))

            araea_all.push({
              row_distan,
              table_name: _res.table_name,
              name: statues.name,
              status: statues.status_code,
            })
          })
        } else {
          araea_all.push({
            row_distan: 0,
            table_name: _res.table_name,
            name: statues.name,
            status: statues.status_code
          })
        }
      }
    }
  } else {
    for (const i in status_shape) {
      if (Object.hasOwnProperty.call(status_shape, i)) {
        const statues = status_shape[i];
        for (const a in table_name) {
          if (Object.hasOwnProperty.call(table_name, a)) {
            const element = table_name[a];
            sql = await sequelizeString(`SELECT COUNT(*)  FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql} `);
            sql.forEach(({ count }) => {
              arr_sql.push({
                count,
                table_name: element.table_name,
                name: statues.name,
                status: statues.status_code,
                status_color: statues.status_color
              });
            });

            //หาระยะทาง
            sql1 = await sequelizeString(`SELECT row_distan, status FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
            if (sql1.length > 0) {

              sql1.forEach(({ row_distan }) => {
                row_distan = (Math.round((Number(row_distan) * 100.0) / 100.0))

                araea_all.push({
                  row_distan,
                  table_name: element.table_name,
                  name: statues.name,
                  status: statues.status_code,
                })
              })
            } else {
              araea_all.push({
                row_distan: 0,
                table_name: element.table_name,
                name: statues.name,
                status: statues.status_code
              })
            }
          }
        }
      }
    }
  }


  const _temp = [], ___temp = []
  arr_sql.forEach((e) => {
    e.count = Number(e.count);
    const index = _temp.findIndex((x) => x.name === e.name);
    if (index === -1) {
      _temp.push(e);
    } else {
      _temp[index].count += e.count;
    }
  });

  araea_all.forEach((e) => {
    e.row_distan = Number(e.row_distan)
    const int = ___temp.findIndex((n) => n.name === e.name)
    if (int === -1) {
      ___temp.push(e);
    } else {
      ___temp[int].row_distan += e.row_distan;
    }
  })
  // แปลงเป็นกิโลเมตร ทศนิยม 2 ตำแหน่ง //
  ___temp.forEach((e) => {
    e.row_distan = Math.round((e.row_distan / 1000) * 100) / 100
  });

  return { _temp, ___temp }
};


exports.getReportDashboardService = async (search, project_name, prov, amp, tam, layer_group) => {
  const table_name = await func_table_name();
  const tempData = []
  for (let i = 0; i < table_name.length; i++) {
    const allTableShape = table_name[i];
    let res_sql = await sequelizeString(`
    SELECT 
      gid, 
      row_distan,
      prov,
      amp,
      tam,
      sta.status_code,
      sta.name,
      sta.status_color 
    FROM shape_data.${allTableShape.table_name}
    INNER JOIN master_lookup.mas_status_project sta ON sta.status_code = status `);

    res_sql.forEach(e => {
      tempData.push(e)
    });
  }
  return tempData
}


exports.getFromReportDashbordService = async (search, project_name, prov, amp, tam, layer_group) => {

  const table_name = await func_table_name();
  const arr_sql = [], araea_all = [], array_prov = [], _prov = [], _amp = [], _tam = []
  var sql, sql1, sql2, _res, val_sql = ``

  if (search) val_sql = ` AND ${project_name} ILIKE '%${search}%' `;
  if (prov) val_sql += ` AND prov = '${prov}' `;
  if (amp) val_sql += ` AND amp = '${amp}' `;
  if (tam) val_sql += ` AND tam = '${tam}' `;

  

  const status_shape = await models.mas_status_project.findAll({ order: [["sort", "ASC"]] });
  if (layer_group) {
    _res = await models.mas_layers_shape.findByPk(layer_group);
    for (const i in status_shape) {
      if (Object.hasOwnProperty.call(status_shape, i)) {
        const statues = status_shape[i];
        sql = await sequelizeString(`SELECT COUNT(*), status FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql} GROUP BY status `);
        sql.forEach(({ count, status }) => {
          arr_sql.push({
            count,
            table_name: _res.table_name,
            name: statues.name,
            status
          });
        });

        //หาระยะทาง
        sql1 = await sequelizeString(`SELECT row_distan, status FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
        if (sql1.length > 0) {
          sql1.forEach(({ row_distan, status }) => {
            row_distan = (Math.round((Number(row_distan) * 100.0) / 100.0));
            araea_all.push({
              row_distan,
              table_name: _res.table_name,
              name: statues.name,
              status
            })
          })
        } else {
          araea_all.push({
            row_distan: 0,
            table_name: _res.table_name,
            name: statues.name,
            status: statues.status_code
          })
        }
        // เรียกจังหวัด อำเภอตำบล
        sql2 = await sequelizeString(`SELECT prov, amp, tam FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
        sql2.forEach(({ prov, amp, tam }) => {
          array_prov.push({ prov, amp, tam })
        })
      }
    }

  } else {
    for (const i in status_shape) {
      if (Object.hasOwnProperty.call(status_shape, i)) {
        const statues = status_shape[i];
        for (const a in table_name) {
          if (Object.hasOwnProperty.call(table_name, a)) {
            const element = table_name[a];
            sql = await sequelizeString(`SELECT COUNT(*)  FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql} `);
            sql.forEach(({ count }) => {
              arr_sql.push({
                count,
                table_name: element.table_name,
                name: statues.name,
                status: statues.status_code,
              });
            });

            //หาระยะทาง
            sql1 = await sequelizeString(`SELECT row_distan, status FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
            if (sql1.length > 0) {

              sql1.forEach(({ row_distan }) => {
                row_distan = (Math.round((Number(row_distan) * 100.0) / 100.0))

                araea_all.push({
                  row_distan,
                  table_name: element.table_name,
                  name: statues.name,
                  status: statues.status_code
                })
              })
            } else {
              araea_all.push({
                row_distan: 0,
                table_name: element.table_name,
                name: statues.name,
                status: statues.status_code
              })
            }
            // เรียกจังหวัด อำเภอตำบล
            sql2 = await sequelizeString(`SELECT prov, amp, tam FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
            sql2.forEach(({ prov, amp, tam }) => {
              array_prov.push({ prov, amp, tam })
            })
          }
        }
      }
    }
  }

  // ทำข้อมูลแปลงทั้งหมดใน shape
  const arrStatus = [], ___temp = []
  arr_sql.forEach((e) => {
    e.count = Number(e.count);
    const index = arrStatus.findIndex((x) => x.name === e.name);
    if (index === -1) {
      arrStatus.push(e);
    } else {
      arrStatus[index].count + e.count;
    }
  });

  // คำนวณระยะทาง
  araea_all.forEach((e) => {
    e.row_distan = Number(e.row_distan)
    const int = ___temp.findIndex((n) => n.name === e.name)
    if (int === -1) {
      ___temp.push(e);
    } else {
      ___temp[int].row_distan += e.row_distan;
    }
  })
  // แปลงเป็นกิโลเมตร ทศนิยม 2 ตำแหน่ง //
  ___temp.forEach((e) => {
    e.row_distan = Math.round((e.row_distan / 1000) * 100) / 100
  });

  //ทำจังหวัดไม่ให้ซ้ำกัน และใส่ค่า pk fk
  array_prov.forEach((e, i) => {
    if (e.prov || e.amp || e.tam) {
      const i1 = _prov.findIndex((x) => x.name === e.prov.replace(/\n/g, ""));
      if (i1 === -1 && e.prov) {
        _prov.push({
          id: i + 1,
          name: e.prov.replace(/\n/g, ""),
        });
      }

      const i2 = _amp.findIndex((x) => x.name === e.amp.replace(/\n/g, ""));
      if (i2 === -1 && e.amp) {
        _amp.push({
          id: i + 1,
          prov_id: _prov[_prov.findIndex((x) => x.name === e.prov.replace(/\n/g, ""))]
            .id,
          name: e.amp.replace(/\n/g, ""),
        });
      }

      const i3 = _tam.findIndex((x) => x.name === e.tam.replace(/\n/g, ""));
      if (i3 === -1 && e.tam) {
        _tam.push({
          id: i + 1,
          amp_id: _amp[_amp.findIndex((x) => x.name === e.amp.replace(/\n/g, ""))].id,
          name: e.tam.replace(/\n/g, ""),
        });
      }
    } else[];
  });

  return { _status: arrStatus, _prov, _amp, _tam }

};

exports.getFromReportDashbordServiceEach = async (search, project_name, prov, amp, tam, layer_group) => {

  const table_name = await func_table_name();
  const arr_sql = [], araea_all = [], array_prov = [], _prov = [], _amp = [], _tam = []
  var sql, sql1, sql2, _res, val_sql = ``

  if (search) val_sql = ` AND ${project_name} ILIKE '%${search}%' `;
  if (prov) val_sql += ` AND prov = '${prov}' `;
  if (amp) val_sql += ` AND amp = '${amp}' `;
  if (tam) val_sql += ` AND tam = '${tam}' `;

  const status_shape = await models.mas_status_project.findAll({ order: [["sort", "ASC"]] });
  if (layer_group) {
    _res = await models.mas_layers_shape.findByPk(layer_group);
    for (const i in status_shape) {
      if (Object.hasOwnProperty.call(status_shape, i)) {
        const statues = status_shape[i];
        sql = await sequelizeString(`SELECT COUNT(*), prov, amp, tam  FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql} group by (prov,amp,tam) `);
        sql.forEach(({ count, prov, amp, tam }) => {
          arr_sql.push({
            count,
            table_name: _res.table_name,
            name: statues.name,
            status: statues.status_code,
            prov,
            amp,
            tam
          });
        });

        //หาระยะทาง
        sql1 = await sequelizeString(`SELECT row_distan, status, prov, amp, tam FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
        if (sql1.length > 0) {
          sql1.forEach(({ row_distan, prov, amp, tam }) => {
            row_distan = (Math.round((Number(row_distan) * 100.0) / 100.0))

            araea_all.push({
              row_distan,
              table_name: _res.table_name,
              name: statues.name,
              status: statues.status_code,
              prov,
              amp,
              tam
            })
          })
        } else {
          araea_all.push({
            row_distan: 0,
            table_name: _res.table_name,
            name: statues.name,
            status: statues.status_code,
            prov,
            amp,
            tam
          })
        }
        // เรียกจังหวัด อำเภอตำบล
        sql2 = await sequelizeString(`SELECT prov, amp, tam FROM shape_data.${_res.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
        sql2.forEach(({ prov, amp, tam }) => {
          array_prov.push({ prov, amp, tam })
        })
      }
    }
  } else {
    for (const i in status_shape) {
      if (Object.hasOwnProperty.call(status_shape, i)) {
        const statues = status_shape[i];
        for (const a in table_name) {
          if (Object.hasOwnProperty.call(table_name, a)) {
            const element = table_name[a];
            sql = await sequelizeString(`SELECT COUNT(*), prov, amp, tam  FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql} group by (prov,amp,tam) `);
            sql.forEach(({ count, prov, amp, tam }) => {
              arr_sql.push({
                count,
                table_name: element.table_name,
                name: statues.name,
                status: statues.status_code,
                prov,
                amp,
                tam
              });
            });

            //หาระยะทาง
            sql1 = await sequelizeString(`SELECT row_distan, status, prov, amp, tam FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
            if (sql1.length > 0) {
              sql1.forEach(({ row_distan, prov, amp, tam }) => {
                row_distan = (Math.round((Number(row_distan) * 100.0) / 100.0))

                araea_all.push({
                  row_distan,
                  table_name: element.table_name,
                  name: statues.name,
                  status: statues.status_code,
                  prov,
                  amp,
                  tam
                })
              })
            } else {
              araea_all.push({
                row_distan: 0,
                table_name: element.table_name,
                name: statues.name,
                status: statues.status_code,
                prov,
                amp,
                tam
              })
            }
            // เรียกจังหวัด อำเภอตำบล
            sql2 = await sequelizeString(`SELECT prov, amp, tam FROM shape_data.${element.table_name} WHERE status = '${statues.status_code}' ${val_sql}`);
            sql2.forEach(({ prov, amp, tam }) => {
              array_prov.push({ prov, amp, tam })
            })
          }
        }
      }
    }
  }

  // ทำข้อมูลแปลงทั้งหมดใน shape
  const Sumpottam = [], Sumareatam = []
  arr_sql.forEach((e) => {
    e.count = Number(e.count);
    const index = Sumpottam.findIndex((x) => x.tam === e.tam && x.name === e.name);
    if (index === -1) {
      Sumpottam.push(e);
    } else {
      Sumpottam[index].count += e.count;
    }
  });

  // คำนวณระยะทาง
  araea_all.forEach((e) => {
    e.row_distan = Number(e.row_distan)
    const int = Sumareatam.findIndex((n) => n.tam === e.tam && n.name === e.name)
    if (int === -1) {
      Sumareatam.push(e);
    } else {
      Sumareatam[int].row_distan += e.row_distan;
    }
  })
  // แปลงเป็นกิโลเมตร ทศนิยม 2 ตำแหน่ง //
  Sumareatam.forEach((e) => {
    e.row_distan = Math.round((e.row_distan / 1000) * 100) / 100
  });

  //ทำจังหวัดไม่ให้ซ้ำกัน และใส่ค่า pk fk
  array_prov.forEach((e, i) => {
    if (e.prov || e.amp || e.tam) {
      const i1 = _prov.findIndex((x) => x.name === e.prov.replace(/\n/g, ""));
      if (i1 === -1 && e.prov) {
        _prov.push({
          id: i + 1,
          name: e.prov.replace(/\n/g, ""),
        });
      }

      const i2 = _amp.findIndex((x) => x.name === e.amp.replace(/\n/g, ""));
      if (i2 === -1 && e.amp) {
        _amp.push({
          id: i + 1,
          prov_id: _prov[_prov.findIndex((x) => x.name === e.prov.replace(/\n/g, ""))]
            .id,
          name: e.amp.replace(/\n/g, ""),
        });
      }

      const i3 = _tam.findIndex((x) => x.name === e.tam.replace(/\n/g, ""));
      if (i3 === -1 && e.tam) {
        _tam.push({
          id: i + 1,
          amp_id: _amp[_amp.findIndex((x) => x.name === e.amp.replace(/\n/g, ""))].id,
          name: e.tam.replace(/\n/g, ""),
        });
      }
    } else[];
  });

  return { Sumpottam, Sumareatam }

};


