const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_subdistrict', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสหลักตำบล",
      primaryKey: true
    },
    subdit_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "โค้ดตำบล"
    },
    zip_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "รหัสไปรษณี"
    },
    name_th: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อภาษาไทย"
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อภาษาอังกฤษ"
    },
    dit_id: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "รหัส อำเภอตารางเดิม"
    },
    district_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัส อำเภอ",
      references: {
        model: 'mas_district',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'mas_subdistrict',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_subdistrict_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
