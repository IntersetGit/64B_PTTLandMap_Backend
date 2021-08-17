var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _dat_layers = require("./dat_layers");
var _dat_profile_users = require("./dat_profile_users");
var _mas_layer_groups = require("./mas_layer_groups");
var _mas_name_titles = require("./mas_name_titles");
var _sysm_roles = require("./sysm_roles");
var _sysm_users = require("./sysm_users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var dat_layers = _dat_layers(sequelize, DataTypes);
  var dat_profile_users = _dat_profile_users(sequelize, DataTypes);
  var mas_layer_groups = _mas_layer_groups(sequelize, DataTypes);
  var mas_name_titles = _mas_name_titles(sequelize, DataTypes);
  var sysm_roles = _sysm_roles(sequelize, DataTypes);
  var sysm_users = _sysm_users(sequelize, DataTypes);

  dat_layers.belongsTo(mas_layer_groups, { as: "group_layer", foreignKey: "group_layer_id"});
  mas_layer_groups.hasMany(dat_layers, { as: "dat_layers", foreignKey: "group_layer_id"});
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
    SequelizeMeta,
    dat_layers,
    dat_profile_users,
    mas_layer_groups,
    mas_name_titles,
    sysm_roles,
    sysm_users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
