const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_layer_groups', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
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
    tableName: 'mas_layer_groups',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_layer_groups_pkey",
        unique: true,
        fields: [
          { name: "group_name" },
        ]
      },
    ]
  });
};
