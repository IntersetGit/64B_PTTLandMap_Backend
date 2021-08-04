const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dat_layers', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    mas_layer_group_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    layer_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    sort: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dat_layers',
    schema: 'ptt_data',
    timestamps: false,
    indexes: [
      {
        name: "dat_layers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
