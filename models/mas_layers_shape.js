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
        model: 'mas_layer_groups',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    wms_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type_server: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    option_layer: {
      type: DataTypes.JSON,
      allowNull: true
    },
    symbol_point: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type_geo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    config_color: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    table_name_arr: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    order_by: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "ตัวจัดการลำดับข้อมูล"
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
