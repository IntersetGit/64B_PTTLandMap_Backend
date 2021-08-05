'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('mas_layer_groups', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
        comment: "",
      },
      group_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: "",
      },
      order_by: {
        type: Sequelize.SMALLINT(1),
        allowNull: true,
        comment: "เรียงลำดับ",
      },
      isuse: {
        type: Sequelize.SMALLINT(1),
        allowNull: false,
        comment: "สถานะข้อมูล 0 = ไม่ใช้ 1 = ใช้",
      }
    }, {
      schema: "master_lookup",
      comment: "",
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable({
      tableName: "mas_layer_groups",
      schema: "master_lookup",
    })
  }
};
