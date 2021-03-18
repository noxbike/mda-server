'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reservation_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      association: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      calendarId: {
        type: Sequelize.STRING
      },
      nbrPerson: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
      },
      end: {
        type: Sequelize.STRING
      },
      start: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reservation_data');
  }
};