const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('geometry', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    geom: {
      type: DataTypes.GEOMETRY('GEOMETRY', 0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'geometry',
    schema: 'shape_data',
    timestamps: false,
    indexes: [
      {
        name: "geometry_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
