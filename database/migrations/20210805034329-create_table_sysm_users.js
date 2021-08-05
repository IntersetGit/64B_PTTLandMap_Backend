'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('sysm_users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสผู้ใช้งาน",
      },
      roles_id:{
        type: Sequelize.UUID,
          allowNull: false,
          comment: "สร้างข้อมูลโดย",
          references: {
            model: {
              tableName: "sysm_roles",
              schema: "system",
            },
            key: "id",
          },
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อผู้ใช้งานระบบ",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "รหัสผ่านผู้ใช้งาน",
      },
      e_mail:{
        type: Sequelize.STRING,
        allowNull: true,
        comment: "อีเมลผู้ใช้งาน",
      },
      note:{
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "บันทึก",
      },
      status_login:{
        type: Sequelize.SMALLINT(1),
        allowNull: true,
        comment: "สถานะการเข้าสูระบบ 0 = ออฟไลน์ 1 = ออนไลน์",
      },
      isuse: {
        type: Sequelize.SMALLINT(1),
        allowNull: false,
        comment: "สถานะผู้ใช้งาน 0 = ไม่ได้ใช้งาน 1 = ใช้งานอยู่ 2 = เลิกใช้งาน",
      },
      last_login:{
        type: Sequelize.DATE,
        allowNull: true,
        comment: "เข้าระบบล่าสุด",
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
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
        allowNull: true,
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
    }, {
      schema: "system",
      comment: "ตารางผู้ใช้งาน",
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "sysm_users",
      schema: "system",
    })
  }
};
