const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_name_titles', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสหลักตารางคำนำหน้าชื่อ",
      primaryKey: true
    },
    code_id: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "โค้ดกำกับคำนำหน้าชื่อ"
    },
    name_title: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "คำนำหน้าชื่อเก็บเป็น json เพื่อรองรับหลายภาษา"
    },
    initials: {
      type: DataTypes.JSON,
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
      defaultValue: 0,
      comment: "สถานะการเรียกใช้งาน"
    }
  }, {
    sequelize,
    tableName: 'mas_name_titles',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_name_title_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
