const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ROW_line', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('MULTILINESTRING', 32647),
      allowNull: true
    },
    OBJECTID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PROJECT_NA: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ROUTECODE: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DATE_MODIF: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    USER_UPDAT: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ROW_WIDTH: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SHAPE_Length: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ROW_line',
    schema: 'kml_data',
    timestamps: false,
    indexes: [
      {
        name: "ROW_line_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
