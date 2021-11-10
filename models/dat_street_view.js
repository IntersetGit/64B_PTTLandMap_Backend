const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dat_street_view', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    coordinate: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "พิกัด เก็บเป็น json"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ชื่อภาพถ่าย"
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'sysm_users',
        key: 'id'
      }
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dat_street_view',
    schema: 'ptt_data',
    timestamps: false,
    indexes: [
      {
        name: "dat_street_view_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fki_fk_dsv_created_by",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fki_fk_dsv_updated_by",
        fields: [
          { name: "updated_by" },
        ]
      },
    ]
  });
};
