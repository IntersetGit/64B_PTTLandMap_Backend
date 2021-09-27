const sequelize = require("../config/dbConfig"); //connect db  query string
const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { ldap } = require("../service/ldapService");
const { error } = require("../messages/index");
const { getKml } = require("../service/testKml");

exports.demoLdap = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { username, password } = req.body

    const _res = await ldap({ user_name: username, password }, transaction)

    result(res, _res);

  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};


exports.demoShap = async (req, res, next) => {
  try {
   
  //  shap('../public/testShapfile/GIS_PatternData.gdb.zip').then(res_ => {
  //    console.log(res_);
  //  })

    // result(res, await shp.combine([shp.parseShp('../public/testShapfile/GIS_PatternData.gdb.zip')])) 

  } catch (error) {
    next(error);
  }
}





exports.gatKmlTest = async (req, res, next) => {
  try {
    result(res, await getKml());
  } catch (error) {
    next(error);
  }
}






// import fs from 'graceful-fs'
// import geo from 'verrazzano'

// const As = require("graceful-fs")
// const geo = require("verrazzano")

// As.createReadStream('testkml.kml')
//   .pipe(geo.from('kml'))
//   .pipe(geo.to('kmz'))
//   .pipe(As.createWriteStream('testkml.kmz'))

//   console.log(As)

// var KMZGeoJSON = require('kmz-geojson');
// console.log(datakml)
// var KMZUrl = "../testkmz.kmz";

// var datakml =  KMZGeoJSON.toKML(KMZUrl, function(err, kml) {
//   // console.log(kml)
// });
// console.log(datakml)

// KMZGeoJSON.toGeoJSON(KMZUrl, function(err, json) {
//   // Do something with the GeoJSON data.
// });