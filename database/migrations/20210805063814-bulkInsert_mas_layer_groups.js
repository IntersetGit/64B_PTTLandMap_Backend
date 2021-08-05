'use strict';

const mas_layer_groups = require('../data/mas_layer_groups')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'mas_layer_groups', schema: 'master_lookup' }, mas_layer_groups)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
