const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_layers_shape', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name_layer: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
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
    text_table: {
      type: DataTypes.STRING,
      allowNull: true
    },
    group_layer_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mas_layers_shape',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_layers_shape_pkey",
        unique: true,
        fields: [
          { name: "name_layer" },
        ]
      },
    ]
  });
};
