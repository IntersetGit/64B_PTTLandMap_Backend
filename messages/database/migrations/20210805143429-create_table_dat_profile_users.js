'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('dat_profile_users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "รหัสข้อมูลส่วนตัวผู้งานระบบ",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: "รหัสผู้ใช้งานระบบ",
        references: {
          model: {
            tableName: "sysm_users",
            schema: "system",
          },
          key: "id",
        },
      },
      name_title_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: "รหัสคำนำหน้า",
        references: {
          model: {
            tableName: "mas_name_titles",
            schema: "master_lookup",
          },
          key: "id",
        },
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อจริงผู้ใช้",
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "นามสกุลผู้ใช้",
      },
      initials: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ชื่อย่อผู้ใช้",
      },
      e_mail: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "อีเมลผู้ใช้งาน",
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "บริษัทที่ทำงาน",
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "แผนก/หน่วยงานที่ทำงาน",
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "งานปัจจุบันที่ทำงาน",
      },
      office: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "",
      },
      web_page: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "เว็บเพจ",
      },
      phone: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: "เบอร์ติดต่อ",
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "ที่อยู่",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "บันทึกรายละเอียด",
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
    }, {
      schema: "ptt_data",
      comment: "ตารางข้อมูลส่วนตัวผู้ใช้งานระบบ"
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "dat_profile_users",
      schema: "ptt_data",
    })
  }
};
