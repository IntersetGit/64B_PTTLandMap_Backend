const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysm_roles', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "รหัสตารางสิทธิ์ผู้ใช้งาน",
      primaryKey: true
    },
    roles_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ชื่อสิทธิ์"
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสแม่ใน role_id"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้ 2 = ลบ"
    }
  }, {
    sequelize,
    tableName: 'sysm_roles',
    schema: 'system',
    timestamps: false,
    indexes: [
      {
        name: "sysm_roles_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
