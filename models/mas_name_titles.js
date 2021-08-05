const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_name_titles', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสคำนำหน้าชื่อ",
      primaryKey: true
    },
    code_id: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "โค้ดกำกับคำนำหน้า"
    },
    name_title: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "คำนำหน้าชื่อเก็บเป็น json เพื่อรองรับหลายภาษา"
    },
    initials: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "ชื่อย่อคำนำหน้าชื่อเก็บเป็น json เพื่อรองรับการใช้หลายภาษา"
    },
    order_by: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "ใช้สำหรับจัดเรียงข้อมูล"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้ 2 = ลบ"
    }
  }, {
    sequelize,
    tableName: 'mas_name_titles',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_name_titles_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
