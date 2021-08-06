const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysm_roles', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสกำหนดสิทธิ์ผู้ใช้งานระบบ",
      primaryKey: true
    },
    roles_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อสิทธิ์ผู้ใช้งานระบบ"
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสแม่ใน role_id"
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "บันทึก"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้ 2 = ลบ"
    },
    order_by: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "ใช้สำหรับจัดเรียงข้อมูล"
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
