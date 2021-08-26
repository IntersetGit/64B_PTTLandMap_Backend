const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_province', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสหลักจังหวัด",
      primaryKey: true
    },
    prov_code: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: "โค้ดจังหวัด"
    },
    prov_text_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "โค้ดจังหวัดตัวอักษร"
    },
    prov_name_th: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อจังหวัดภาษาไทย"
    },
    prov_name_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อจังหวัดภาษาอังกฤษ"
    },
    reg_code: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "โค้ดภูมิภาค"
    },
    cwt_unig: {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment: "รหัสจังหวัดเชื่อมภาค"
    },
    initials: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "ชื่อย่อ"
    }
  }, {
    sequelize,
    tableName: 'mas_province',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_province_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
