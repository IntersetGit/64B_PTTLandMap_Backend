const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysm_config', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    info_form: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sysm_config',
    schema: 'system',
    timestamps: false,
    indexes: [
      {
        name: "sysm_config_pkey1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
