'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('mas_province', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสหลักจังหวัด",
      },
      prov_code: {
        type: Sequelize.STRING(2),
        allowNull: true,
        comment: "โค้ดจังหวัด",
      },
      prov_text_code: {
        type: Sequelize.STRING(5),
        allowNull: true,
        comment: "โค้ดจังหวัดตัวอักษร",
      },
      prov_name_th: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อจังหวัดภาษาไทย",
      },
      prov_name_en: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อจังหวัดภาษาอังกฤษ",
      },
      reg_code: {
        type: Sequelize.STRING(1),
        allowNull: true,
        comment: "โค้ดภูมิภาค",
      },
      cwt_unig: {
        type: Sequelize.STRING(3),
        allowNull: true,
        comment: "รหัสจังหวัดเชื่อมภาค",
      },
      initials: {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: "ชื่อย่อ",
      }

    }, {
      schema: "master_lookup",
      comment: "ตารางข้อมูลจังหวัด"
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "mas_province",
      schema: "master_lookup",
    })
  }
};
