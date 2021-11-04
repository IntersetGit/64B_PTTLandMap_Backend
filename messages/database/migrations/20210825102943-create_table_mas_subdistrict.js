'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('mas_subdistrict',{
      id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสหลักตำบล",
      },
      subdit_code:{
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: "โค้ดตำบล",
      },
      zip_code:{
        type: Sequelize.STRING(5),
        allowNull: true,
        comment: "รหัสไปรษณี",
      },
      name_th:{
          type: Sequelize.STRING,
          allowNull: true,
          comment: "ชื่อภาษาไทย",
      },
      name_en:{
          type: Sequelize.STRING,
          allowNull: true,
          comment: "ชื่อภาษาอังกฤษ",
      },
      dit_id:{
          type: Sequelize.STRING(10),
          allowNull: true,
          comment: "รหัส อำเภอตารางเดิม",
      },
      district_id:{
        type:  Sequelize.UUID,
        allowNull: true,
        comment: "รหัส อำเภอ",
        references: {
          model: {
            tableName: "mas_district",
            schema: "master_lookup",
          },
          key: "id",
        },
      }
    },{
      schema: "master_lookup",
      comment: "ตารางข้อมูลตำบล"
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "mas_subdistrict",
      schema: "master_lookup",
    })
  }
};
