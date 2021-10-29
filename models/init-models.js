var DataTypes = require("sequelize").DataTypes;
var _dat_layers = require("./dat_layers");
var _dat_profile_users = require("./dat_profile_users");
var _mas_district = require("./mas_district");
var _mas_layer_groups = require("./mas_layer_groups");
var _mas_layers_shape = require("./mas_layers_shape");
var _mas_name_titles = require("./mas_name_titles");
var _mas_province = require("./mas_province");
var _mas_status_project = require("./mas_status_project");
var _mas_subdistrict = require("./mas_subdistrict");
var _ptt_kmz_number1 = require("./ptt_kmz_number1");
var _ptt_shape_number1 = require("./ptt_shape_number1");
var _sysm_config = require("./sysm_config");
var _sysm_roles = require("./sysm_roles");
var _sysm_users = require("./sysm_users");

function initModels(sequelize) {
  var dat_layers = _dat_layers(sequelize, DataTypes);
  var dat_profile_users = _dat_profile_users(sequelize, DataTypes);
  var mas_district = _mas_district(sequelize, DataTypes);
  var mas_layer_groups = _mas_layer_groups(sequelize, DataTypes);
  var mas_layers_shape = _mas_layers_shape(sequelize, DataTypes);
  var mas_name_titles = _mas_name_titles(sequelize, DataTypes);
  var mas_province = _mas_province(sequelize, DataTypes);
  var mas_status_project = _mas_status_project(sequelize, DataTypes);
  var mas_subdistrict = _mas_subdistrict(sequelize, DataTypes);
  var ptt_kmz_number1 = _ptt_kmz_number1(sequelize, DataTypes);
  var ptt_shape_number1 = _ptt_shape_number1(sequelize, DataTypes);
  var sysm_config = _sysm_config(sequelize, DataTypes);
  var sysm_roles = _sysm_roles(sequelize, DataTypes);
  var sysm_users = _sysm_users(sequelize, DataTypes);

  mas_subdistrict.belongsTo(mas_district, { as: "district", foreignKey: "district_id"});
  mas_district.hasMany(mas_subdistrict, { as: "mas_subdistricts", foreignKey: "district_id"});
  mas_layers_shape.belongsTo(mas_layer_groups, { as: "group_layer", foreignKey: "group_layer_id"});
  mas_layer_groups.hasMany(mas_layers_shape, { as: "mas_layers_shapes", foreignKey: "group_layer_id"});
  mas_district.belongsTo(mas_province, { as: "province", foreignKey: "province_id"});
  mas_province.hasMany(mas_district, { as: "mas_districts", foreignKey: "province_id"});
  mas_layer_groups.belongsTo(sysm_users, { as: "created_by_sysm_user", foreignKey: "created_by"});
  sysm_users.hasMany(mas_layer_groups, { as: "mas_layer_groups", foreignKey: "created_by"});
  mas_layer_groups.belongsTo(sysm_users, { as: "update_by_sysm_user", foreignKey: "update_by"});
  sysm_users.hasMany(mas_layer_groups, { as: "update_by_mas_layer_groups", foreignKey: "update_by"});
  dat_profile_users.belongsTo(mas_name_titles, { as: "name_title", foreignKey: "name_title_id"});
  mas_name_titles.hasMany(dat_profile_users, { as: "dat_profile_users", foreignKey: "name_title_id"});
  dat_layers.belongsTo(sysm_users, { as: "created_by_sysm_user", foreignKey: "created_by"});
  sysm_users.hasMany(dat_layers, { as: "dat_layers", foreignKey: "created_by"});
  dat_layers.belongsTo(sysm_users, { as: "update_by_sysm_user", foreignKey: "update_by"});
  sysm_users.hasMany(dat_layers, { as: "update_by_dat_layers", foreignKey: "update_by"});
  dat_profile_users.belongsTo(sysm_users, { as: "created_by_sysm_user", foreignKey: "created_by"});
  sysm_users.hasMany(dat_profile_users, { as: "dat_profile_users", foreignKey: "created_by"});
  dat_profile_users.belongsTo(sysm_users, { as: "update_by_sysm_user", foreignKey: "update_by"});
  sysm_users.hasMany(dat_profile_users, { as: "update_by_dat_profile_users", foreignKey: "update_by"});
  dat_profile_users.belongsTo(sysm_users, { as: "user", foreignKey: "user_id"});
  sysm_users.hasMany(dat_profile_users, { as: "user_dat_profile_users", foreignKey: "user_id"});
  sysm_users.belongsTo(sysm_roles, { as: "role", foreignKey: "roles_id"});
  sysm_roles.hasMany(sysm_users, { as: "sysm_users", foreignKey: "roles_id"});
  sysm_users.belongsTo(sysm_users, { as: "created_by_sysm_user", foreignKey: "created_by"});
  sysm_users.hasMany(sysm_users, { as: "sysm_users", foreignKey: "created_by"});
  sysm_users.belongsTo(sysm_users, { as: "update_by_sysm_user", foreignKey: "update_by"});
  sysm_users.hasMany(sysm_users, { as: "update_by_sysm_users", foreignKey: "update_by"});

  return {
    dat_layers,
    dat_profile_users,
    mas_district,
    mas_layer_groups,
    mas_layers_shape,
    mas_name_titles,
    mas_province,
    mas_status_project,
    mas_subdistrict,
    ptt_kmz_number1,
    ptt_shape_number1,
    sysm_config,
    sysm_roles,
    sysm_users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
