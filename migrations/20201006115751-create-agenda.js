'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Agendas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titre: {
        type: Sequelize.STRING
      },
      du: {
        type: Sequelize.DATE
      },
      au: {
        type: Sequelize.DATE
      },
      photo: {
        type: Sequelize.STRING
      },
      contenu: {
        type: Sequelize.TEXT
      },
      ou: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      auteur:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('Agendas');
  }
};