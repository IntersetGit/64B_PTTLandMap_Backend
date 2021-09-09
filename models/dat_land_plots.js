const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dat_land_plots', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    group_layer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'mas_layer_groups',
        key: 'id'
      }
    },
    objectid: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    project_na: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    partype: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parlabel1: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel2: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel3: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel4: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parlabel5: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    mas_prov_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'mas_province',
        key: 'id'
      }
    },
    mas_dist_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'mas_district',
        key: 'id'
      }
    },
    mas_subdist_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'mas_subdistrict',
        key: 'id'
      }
    },
    area_geometry: {
      type: DataTypes.JSON,
      allowNull: true
    },
    area_rai: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    area_ngan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    area_wa: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    parcel_own: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parcel_o_1: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    parcel_o_2: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    row_rai: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    row_ngan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    row_wa: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    row_distan: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    shape_leng: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    shape_area: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    path_image: {
      type: DataTypes.JSON,
      allowNull: true
    },
    isuse: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "สถานะใช้งานข้อมูล"
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dat_land_plots',
    schema: 'ptt_data',
    timestamps: false,
    indexes: [
      {
        name: "dat_land_plots_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fki_fk_dlp_group_layer_id",
        fields: [
          { name: "group_layer_id" },
        ]
      },
      {
        name: "fki_fk_dlp_mas_dist_id",
        fields: [
          { name: "mas_dist_id" },
        ]
      },
      {
        name: "fki_fk_dlp_mas_prov_id",
        fields: [
          { name: "mas_prov_id" },
        ]
      },
      {
        name: "fki_fk_dlp_mas_subdist_id",
        fields: [
          { name: "mas_subdist_id" },
        ]
      },
      {
        name: "fki_fk_dlp_user_id",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
