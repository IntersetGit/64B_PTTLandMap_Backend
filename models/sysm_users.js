const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysm_users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสผู้ใช้งาน",
      primaryKey: true
    },
    roles_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "สร้างข้อมูลโดย",
      references: {
        model: 'sysm_roles',
        key: 'id'
      }
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อผู้ใช้งานระบบ"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "รหัสผ่านผู้ใช้งาน"
    },
    e_mail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "อีเมลผู้ใช้งาน"
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "บันทึก"
    },
    status_login: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "สถานะการเข้าสูระบบ 0 = ออฟไลน์ 1 = ออนไลน์"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะผู้ใช้งาน 0 = ไม่ได้ใช้งาน 1 = ใช้งานอยู่ 2 = เลิกใช้งาน"
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "เข้าระบบล่าสุด"
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
    tableName: 'sysm_users',
    schema: 'system',
    timestamps: false,
    indexes: [
      {
        name: "sysm_users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
