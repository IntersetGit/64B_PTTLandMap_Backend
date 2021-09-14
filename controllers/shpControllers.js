const shapefile = require("shapefile");
const result = require("../middleware/result");
const shp = require('shpjs');
const { convert } = require("geojson2shp");
const { addShapeService, getAllShape, getDataLayerService } = require("../service/dat_land_plots");
const { getDataShapService } = require('../service/shape_layers')
const fs = require('fs');
const uuid = require('uuid');
const config = require('../config');
const { url } = require("inspector");


exports.shapeAdd = async (req, res, next) => {
    try {

        if (!req.files) {
            const err = new Error('ต้องการไฟล์เพื่ออัพโหลด')
            err.statusCode = 404
            throw err
        } else {
            const { file } = req.files
            const { color } = req.body
            const { sysm_id } = req.user
    
            const geojson = await shp(file.data.buffer);
            console.log(geojson);
    
            // if(!){
    
            // }
            for (const i in geojson.features) {
                if (Object.hasOwnProperty.call(geojson.features, i)) {
                    const e = geojson.features[i];
                    console.log(`object`, e.geometry)
                    console.log(`object`, e.properties)
    
                    const _res =  await addShapeService({
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
                    })
                    result(res, _res, 201);
                }
            }
        }

        
    } catch (error) {
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
        const get_land_plot = await getDataLayerService()

        result(res, {
            land_plot: {
                land_plot_order: get_shp,
                get_land_plot
            },
            gas_line: {},
            construction_method: {},
            system_field: {},
            info: {}
        })

    } catch (error) {
        next(error);
    }
}

exports.changecolor

//--------- แสดงข้อมูล shp -----------//
exports.getAllShape = async (req, res, next) => {
    try {
        result(res, await getAllShape());
    } catch (error) {
        next(error);
    }
}