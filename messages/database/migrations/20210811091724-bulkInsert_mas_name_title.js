'use strict';
const mas_name_titles = require('../data/mas_name_title_json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'mas_name_titles', schema: 'master_lookup' }, mas_name_titles)
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
