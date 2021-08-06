const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dat_profile_users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสข้อมูลส่วนตัวผู้งานระบบ",
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "รหัสผู้ใช้งานระบบ",
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อจริงผู้ใช้"
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "นามสกุลผู้ใช้"
    },
    initials: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อย่อผู้ใช้"
    },
    e_mail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "อีเมลผู้ใช้งาน"
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "บริษัทที่ทำงาน"
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "แผนก\/หน่วยงานที่ทำงาน"
    },
    job_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "งานปัจจุบันที่ทำงาน"
    },
    office: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    web_page: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "เว็บเพจ"
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "เบอร์ติดต่อ"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ที่อยู่"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "บันทึกรายละเอียด"
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "สร้างข้อมูลโดย",
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: 'dat_profile_users',
    schema: 'ptt_data',
    timestamps: false,
    indexes: [
      {
        name: "dat_profile_users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
