'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('mas_district', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "ตารางควบคุมอำเภอ",
      },
     dit_id: {
        type: Sequelize.STRING(4),
        allowNull: true,
        comment: "รหัสอำเภอตารางเดิม",
      },
      dit_code: {
       type: Sequelize.STRING(2),
       allowNull: true,
       comment: "Code อำเภอ",
     },
      name_th: {
     type: Sequelize.TEXT ,
     allowNull: true,
     comment: "ชื่อภาษาไทย",
   },
   name_en: {
    type: Sequelize.TEXT ,
    allowNull: true,
    comment: "ชื่อภาษาอังกฤษ",
  },
  prov_code: {
    type: Sequelize.STRING(2),
    allowNull: true,
    comment: "โค้ดจังหวัด",
  },
  province_id: {
    type: Sequelize.UUID,
    allowNull: true,
    comment: "โค้ดจังหวัด",
    references: {
      model: {
        tableName: "mas_province",
        schema: "master_lookup",
      },
      key: "id",
    },

  },

  },{
    schema: "master_lookup",
    comment: "ตารางข้อมูลจังหวัด"
  })
},

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "mas_district",
      schema: "master_lookup",
    })
  }
};
