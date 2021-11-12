const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Feature Labels (NUMBER)', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    begin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    altitudeMode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tessellate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    extrude: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visibility: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    drawOrder: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Feature Labels (NUMBER)',
    schema: 'kml_data',
    timestamps: false,
    indexes: [
      {
        name: "Feature Labels (NUMBER)_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
