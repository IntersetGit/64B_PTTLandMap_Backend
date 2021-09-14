const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shape_layers', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name_layer: {
      type: DataTypes.STRING,
      allowNull: true
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
      type: DataTypes.STRING,
      allowNull: true
    },
    group_layer_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'shape_layers',
    schema: 'shape_data',
    timestamps: false,
    indexes: [
      {
        name: "shape_layers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
