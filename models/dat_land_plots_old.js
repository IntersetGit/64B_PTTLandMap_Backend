const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dat_land_plots_old', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสหลักแปลงที่ดิน",
      primaryKey: true
    },
    osm_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "รหัส osm"
    },
    area_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ชื่อพื้นที่แปลงที่ดิน"
    },
    area_polygon: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "เก็บแปลงที่ดินเป็น polygon"
    },
    area_size: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: "ขนาดพื้นที่แปลงที่ดิน"
    },
    mas_layer_group_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสกลุ่มชั้นข้อมูล",
      references: {
        model: 'mas_layer_groups',
        key: 'id'
      }
    },
    mas_prov_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสตารางจังหวัด",
      references: {
        model: 'mas_province',
        key: 'id'
      }
    },
    mas_dist_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสตารางอำเภอ",
      references: {
        model: 'mas_district',
        key: 'id'
      }
    },
    mas_subdist_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "รหัสตารางตำบล",
      references: {
        model: 'mas_subdistrict',
        key: 'id'
      }
    },
    path_image: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "เก็บข้มูลภาพเป็น json"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะใช้งาน 0 = ยังไม่ใช้งาน 1 = ใช้งาน 2 รอลบ"
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
    tableName: 'dat_land_plots_old',
    schema: 'ptt_data',
    timestamps: false,
    indexes: [
      {
        name: "dat_ land_plots_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fki_fk_dlp_created_by",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fki_fk_dlp_dist_id",
        fields: [
          { name: "mas_dist_id" },
        ]
      },
      {
        name: "fki_fk_dlp_layer_group_id",
        fields: [
          { name: "mas_layer_group_id" },
        ]
      },
      {
        name: "fki_fk_dlp_prov_id",
        fields: [
          { name: "mas_prov_id" },
        ]
      },
      {
        name: "fki_fk_dlp_sundist_id",
        fields: [
          { name: "mas_subdist_id" },
        ]
      },
      {
        name: "fki_fk_dlp_updated_by",
        fields: [
          { name: "updated_by" },
        ]
      },
    ]
  });
};
