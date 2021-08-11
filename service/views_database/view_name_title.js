const { sequelizeString, sequelizeStringFindOne } = require('../../util/index')

exports.viewGetNameTitleService = async (id) => {

    let sql = `SELECT * FROM master_lookup.view_name_title WHERE isuse = 1 `

    if(id) sql += ` AND id = '${id}'`
    
    return await sequelizeString(sql)
}