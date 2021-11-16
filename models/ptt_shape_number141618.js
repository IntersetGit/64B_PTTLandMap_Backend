const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ptt_shape_number141618', {
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
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ptype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    namt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    level: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    scale: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    v1_2004: {
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
    tableName: 'ptt_shape_number141618',
    schema: 'shape_data',
    timestamps: false,
    indexes: [
      {
        name: "ptt_shape_number141618_pkey",
        unique: true,
        fields: [
          { name: "gid" },
        ]
      },
    ]
  });
};