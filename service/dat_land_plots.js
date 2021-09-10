const models = require('../models/index')
const uuid4 = require('uuid')
const { Op } = require('sequelize')
const { sequelizeString } = require('../util')

exports.addShapeService = async (model) => {
    const id = uuid4.v4()
    const _model = {
        id,
        isuse: 1,
        user_id: model.user_id,
        created_by: model.created_by,
        created_date: new Date()
    }

    const prov = await models.mas_province.findOne({ where: { prov_name_th: model.prov } })
    const amp = await models.mas_district.findOne({ where: { name_th: { [Op.like]: `%${model.amp}%` } } })
    const tam = await models.mas_subdistrict.findOne({ where: { name_th: { [Op.like]: `%${model.tam}%` } } })

    if (model.objectid) _model.objectid = model.objectid
    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.project_na) _model.project_na = model.project_na
    if (model.parid) _model.parid = model.parid
    if (model.kp) _model.kp = model.kp
    if (model.partype) _model.partype = model.partype
    if (model.parlabel1) _model.parlabel1 = model.parlabel1
    if (model.parlabel2) _model.parlabel2 = model.parlabel2
    if (model.parlabel3) _model.parlabel3 = model.parlabel3
    if (model.parlabel4) _model.parlabel4 = model.parlabel4
    if (model.parlabel5) _model.parlabel5 = model.parlabel5
    if (prov) _model.mas_prov_id = prov.id
    if (amp) _model.mas_dist_id = amp.id
    if (tam) _model.mas_subdist_id = tam.id
    if (model.area_rai) _model.area_rai = model.area_rai
    if (model.area_ngan) _model.area_ngan = model.area_ngan
    if (model.area_wa) _model.area_wa = model.area_wa
    if (model.parcel_own) _model.parcel_own = model.parcel_own
    if (model.parcel_o_1) _model.parcel_o_1 = model.parcel_o_1
    if (model.parcel_o_2) _model.parcel_o_2 = model.parcel_o_2
    if (model.row_rai) _model.row_rai = model.row_rai
    if (model.row_ngan) _model.row_ngan = model.row_ngan
    if (model.row_wa) _model.row_wa = model.row_wa
    if (model.row_distan) _model.row_distan = model.row_distan
    if (model.status) _model.status = model.status
    if (model.remark) _model.remark = model.remark
    if (model.shape_leng) _model.shape_leng = model.shape_leng
    if (model.shape_area) _model.shape_area = model.shape_area
    if (model.path_image) _model.path_image = model.path_image
    if (model.area_geometry) _model.area_geometry = model.area_geometry

    await models.dat_land_plots.create(_model)
    return id
}

exports.getDataLayerService = async () => {
    let sql = `
        SELECT id
        , group_layer_id
        , objectid
        , project_na
        , parid
        , kp
        , mas_prov_id AS prov_id
        , (SELECT prov.prov_name_th FROM master_lookup.mas_province prov WHERE prov.id = mas_prov_id) AS prov_name
        , mas_dist_id AS dist_id
        , (SELECT dis.name_th FROM master_lookup.mas_district dis WHERE dis.id = mas_dist_id) AS dist_name
        , mas_subdist_id AS sub_id
        , (SELECT sub.name_th FROM master_lookup.mas_subdistrict sub WHERE sub.id = mas_subdist_id) AS sub_name
        , area_geometry
        , parcel_own
        , parcel_o_1
        , parcel_o_2

        FROM ptt_data.dat_land_plots 
        WHERE isuse = 1
    `

    return await sequelizeString(sql);
}

exports.getAllShape = async () => {
    return await models.dat_land_plots.findAll()
}
