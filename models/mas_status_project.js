const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_status_project', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    status_code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    sort: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mas_status_project',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_status_project_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
