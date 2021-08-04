const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysm_users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสหลักผู้ใช้งาน",
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "ชื่อผู้ใช้งาน"
    },
    e_mail: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "e-mail ผู้ใช้งานระบบ"
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะผู้ใช้งาน 0 = ไม่ได้ใช้งาน 1 = ใช้งานอยู่ 2 = เลิกใช้งาน"
    },
    status_login: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "สถานะการเข้าสูระบบ 0 = ออฟไลน์ 1 = ออนไลน์"
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "เข้าระบบล่าสุด"
    },
    roles_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสสิทธิ์ผู้ใช้งาน",
      references: {
        model: 'sysm_roles',
        key: 'id'
      }
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
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "ปรับปรุงข้อมูลโดย",
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "ปรับปรุงข้อมูลวันที่"
    }
  }, {
    sequelize,
    tableName: 'sysm_users',
    schema: 'system',
    timestamps: false,
    indexes: [
      {
        name: "fki_fk_su_created_by",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fki_fk_su_roles_id",
        fields: [
          { name: "roles_id" },
        ]
      },
      {
        name: "fki_fk_su_updated_by",
        fields: [
          { name: "updated_by" },
        ]
      },
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
