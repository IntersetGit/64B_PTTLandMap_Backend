const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dat_layers', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      comment: "รหัสหลักจัดการข้อมูลพื้นที่",
      primaryKey: true
    },
    layer_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ชื่อข้อมูลพื้นที่"
    },
    wms_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "url 3 มิติ"
    },
    type_server: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "เก็บเป็นชื่อ เช่น ArcGisServer, GeoServer"
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "สถานะใช้งาน "
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
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    image_type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dat_layers',
    schema: 'ptt_data',
    timestamps: false,
    indexes: [
      {
        name: "dat_layers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
