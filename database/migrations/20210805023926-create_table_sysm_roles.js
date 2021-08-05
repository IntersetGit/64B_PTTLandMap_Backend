'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('sysm_roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสกำหนดสิทธิ์ผู้ใช้งานระบบ",
      },
      roles_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อสิทธิ์ผู้ใช้งานระบบ",
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: "รหัสแม่ใน role_id",
      },
      isuse: {
        type: Sequelize.SMALLINT(1),
        allowNull: true,
        comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้ 2 = ลบ",
      }
    }, {
      schema: "system",
      comment: "ตารางสิทธิ์ผู้ใช้งาน",
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "sysm_roles",
      schema: "system",
    })
  }
};
