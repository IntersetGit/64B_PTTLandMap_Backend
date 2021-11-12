const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ptt_shape_number40191', {
    gid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('MULTILINESTRING', 0),
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
    routecode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_modif: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_updat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    row_width: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shape_leng: {
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
    tableName: 'ptt_shape_number40191',
    schema: 'shape_data',
    timestamps: false,
    indexes: [
      {
        name: "ptt_shape_number40191_pkey",
        unique: true,
        fields: [
          { name: "gid" },
        ]
      },
    ]
  });
};
