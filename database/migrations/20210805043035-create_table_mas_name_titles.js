'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('mas_name_titles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสคำนำหน้าชื่อ",
      },
      code_id: {
        type: Sequelize.STRING(5),
        allowNull: true,
        comment: "โค้ดกำกับคำนำหน้า",
      },
      name_title: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "คำนำหน้าชื่อเก็บเป็น json เพื่อรองรับหลายภาษา",
      },
      initials: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อย่อคำนำหน้าชื่อเก็บเป็น json เพื่อรองรับการใช้หลายภาษา",
      },
      order_by: {
        type: Sequelize.SMALLINT(1),
        allowNull: true,
        comment: "ใช้สำหรับจัดเรียงข้อมูล",
      },
      isuse: {
        type: Sequelize.SMALLINT(1),
        allowNull: false,
        comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้ 2 = ลบ",
      }
    }, {
      schema: "master_lookup",
      comment: "ตารางข้อมูลคำนำหน้าชื่อ",
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "mas_name_titles",
      schema: "master_lookup",
    })
  }
};
