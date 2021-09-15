const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_layer_groups', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสกลุ่มชั้นข้อมูล",
      primaryKey: true
    },
    group_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "ชื่อกลุ่มชั้นข้อมูล"
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
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "สร้างข้อมูลโดย",
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "สร้างข้อมูลวันที่"
    },
    update_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "แก้ไขข้อมูลโดย",
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "แก้ไขข้อมูลวันที่"
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
