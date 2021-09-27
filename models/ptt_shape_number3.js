const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ptt_shape_number3', {
    gid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('MULTIPOLYGON', 0),
      allowNull: true
    },
    objectid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    project_na: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    partype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parlabel1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parlabel2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parlabel3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parlabel4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parlabel5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prov: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tam: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    area_rai: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    area_ngan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    area_wa: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parcel_own: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parcel_o_1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parcel_o_2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    row_rai: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    row_ngan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    row_wa: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    row_distan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shape_leng: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shape_area: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ptt_shape_number3',
    schema: 'shape_data',
    timestamps: false,
    indexes: [
      {
        name: "ptt_shape_number3_pkey",
        unique: true,
        fields: [
          { name: "gid" },
        ]
      },
    ]
  });
};
