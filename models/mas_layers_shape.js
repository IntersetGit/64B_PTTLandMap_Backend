const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_layers_shape', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name_layer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color_layer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    group_layer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'mas_layers_shape',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'mas_layers_shape',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "fki_fk_mls_group_layer_id",
        fields: [
          { name: "group_layer_id" },
        ]
      },
      {
        name: "mas_layers_shape_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
