'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('dat_layers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสหลักจัดการข้อมูลพื้นที่",
      },
      group_layer_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: "รหัสกลุ่มข้อมูลพื้นที่",
        references: {
          model: {
            tableName: "mas_layer_groups",
            schema: "master_lookup",
          },
          key: "id",
        },
      },
      layer_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อข้อมูลพื้นที่",
      },
      wms: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "",
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "",
      },
      wms_url: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "url 3 มิติ",
      },
      type_server: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "เก็บเป็นชื่อ เช่น ArcGisServer, GeoServer",
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: "สร้างข้อมูลโดย",
        references: {
          model: {
            tableName: "sysm_users",
            schema: "system",
          },
          key: "id",
        },
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "สร้างข้อมูลวันที่",
      },
      update_by: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: "แก้ไขข้อมูลโดย",
        references: {
          model: {
            tableName: "sysm_users",
            schema: "system",
          },
          key: "id",
        },
      },
      update_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "แก้ไขข้อมูลวันที่",
      },
    },{
      schema: "ptt_data",
      comment: "ตารางข้อมูลจัดการข้อมูลพื้นที่"
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "dat_layers",
      schema: "ptt_data",
    })
  }
};
