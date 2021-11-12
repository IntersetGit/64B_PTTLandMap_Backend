const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ptt_shape_number169247', {
    gid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('POINT', 0),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    num_pass: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stn_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amp_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amp_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prov_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prove_namt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amp_namt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prov_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    point_x: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    point_y: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    objectid: {
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
    project_na: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parlabel1: {
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
    }
  }, {
    sequelize,
    tableName: 'ptt_shape_number169247',
    schema: 'shape_data',
    timestamps: false,
    indexes: [
      {
        name: "ptt_shape_number169247_pkey",
        unique: true,
        fields: [
          { name: "gid" },
        ]
      },
    ]
  });
};
