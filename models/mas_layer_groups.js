const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_layer_groups', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    group_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    order_by: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "เรียงลำดับ"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้"
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
          { name: "id" },
        ]
      },
    ]
  });
};
