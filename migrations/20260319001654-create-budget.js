'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budget', {
      id_budget: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_daily_report: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'daily_report',
          key: 'id_daily_report'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      item_price: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      total_price: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('budget');
  }
};