const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('เขื่อนป้องกันการกัดเซ', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('POLYGON', 4326),
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
    tableName: 'เขื่อนป้องกันการกัดเซ',
    schema: 'kml_data',
    timestamps: false,
    indexes: [
      {
        name: "เขื่อนป้องกันการกัด_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
