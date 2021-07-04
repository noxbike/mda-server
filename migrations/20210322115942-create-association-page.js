'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssociationPages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      IdentificationAssociationId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Identification_associations',
          key:  'RepresentantLegaleId'
        }
      },
      theme: {
        type: Sequelize.STRING
      },
      lien: {
        type: Sequelize.STRING
      },
      email:{
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.JSON
      },
      slogan: {
        type: Sequelize.TEXT
      },
      histoire: {
        type: Sequelize.TEXT
      },
      map: {
        type: Sequelize.STRING
      },
      social: {
        type: Sequelize.JSON
      },
      contact: {
        type: Sequelize.JSON
      },
      logo: {
        type: Sequelize.STRING
      },
      personne:{
        type: Sequelize.JSON
      },
      mission:{
        type:Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      show: {
        type: Sequelize.BOOLEAN
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AssociationPages');
  }
};