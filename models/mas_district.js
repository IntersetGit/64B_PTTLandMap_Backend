const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mas_district', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "ตารางควบคุมอำเภอ",
      primaryKey: true
    },
    dit_id: {
      type: DataTypes.STRING(4),
      allowNull: true,
      comment: "รหัสอำเภอตารางเดิม"
    },
    dit_code: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: "Code อำเภอ"
    },
    name_th: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ชื่อภาษาไทย"
    },
    name_en: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ชื่อภาษาอังกฤษ"
    },
    prov_code: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: "โค้ดจังหวัด"
    },
    province_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "โค้ดจังหวัด",
      references: {
        model: 'mas_province',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'mas_district',
    schema: 'master_lookup',
    timestamps: false,
    indexes: [
      {
        name: "mas_district_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
