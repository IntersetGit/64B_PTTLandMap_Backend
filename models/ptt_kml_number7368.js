const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ptt_kml_number7368', {
    gid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('POLYGON', 0),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stroke: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stroke_opacity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fill_opacity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tessellate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    extrude: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    visibility: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    snippet: {
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
    tableName: 'ptt_kml_number7368',
    schema: 'kml_data',
    timestamps: false,
    indexes: [
      {
        name: "ptt_kml_number7368_pkey",
        unique: true,
        fields: [
          { name: "gid" },
        ]
      },
    ]
  });
};
