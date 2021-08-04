var DataTypes = require("sequelize").DataTypes;
var _dat_layers = require("./dat_layers");
var _mas_layer_groups = require("./mas_layer_groups");
var _mas_name_titles = require("./mas_name_titles");
var _sysm_roles = require("./sysm_roles");
var _sysm_users = require("./sysm_users");

function initModels(sequelize) {
  var dat_layers = _dat_layers(sequelize, DataTypes);
  var mas_layer_groups = _mas_layer_groups(sequelize, DataTypes);
  var mas_name_titles = _mas_name_titles(sequelize, DataTypes);
  var sysm_roles = _sysm_roles(sequelize, DataTypes);
  var sysm_users = _sysm_users(sequelize, DataTypes);

  sysm_users.belongsTo(sysm_roles, { as: "role", foreignKey: "roles_id"});
  sysm_roles.hasMany(sysm_users, { as: "sysm_users", foreignKey: "roles_id"});
  sysm_users.belongsTo(sysm_users, { as: "created_by_sysm_user", foreignKey: "created_by"});
  sysm_users.hasMany(sysm_users, { as: "sysm_users", foreignKey: "created_by"});
  sysm_users.belongsTo(sysm_users, { as: "updated_by_sysm_user", foreignKey: "updated_by"});
  sysm_users.hasMany(sysm_users, { as: "updated_by_sysm_users", foreignKey: "updated_by"});

  return {
    dat_layers,
    mas_layer_groups,
    mas_name_titles,
    sysm_roles,
    sysm_users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
