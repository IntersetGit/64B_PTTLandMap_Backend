const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shape_layers', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    objectid: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    project_na: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    partype: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parlabel1: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel2: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel3: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel4: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel5: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    mas_prov_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    mas_dist_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    mas_subdist_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    area_geometry: {
      type: DataTypes.JSON,
      allowNull: true
    },
    area_rai: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    area_ngan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    area_wa: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    parcel_own: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parcel_o_1: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parcel_o_2: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    row_rai: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    row_ngan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    row_wa: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    row_distan: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    shape_leng: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    shape_area: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    path_image: {
      type: DataTypes.JSON,
      allowNull: true
    },
    geom: {
      type: DataTypes.GEOMETRY('GEOMETRY', 0),
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
