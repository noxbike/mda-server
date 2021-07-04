'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Identification_associations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomAssociation: {
        type: Sequelize.STRING
      },
      dateParutionAuJournalOfficiel: {
        type: Sequelize.STRING
      },
      sigle: {
        type: Sequelize.STRING
      },
      siret: {
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.STRING
      },
      emailAssociation: {
        type: Sequelize.STRING
      },
      dateCreation: {
        type: Sequelize.STRING
      },
      maldecRna: {
        type: Sequelize.STRING
      },
      adresseSiegeSocial: {
        type: Sequelize.STRING
      },
      codeApe: {
        type: Sequelize.STRING
      },
      numAgrement: {
        type: Sequelize.STRING
      },
      Affiliation: {
        type: Sequelize.STRING
      },
      derniereAssembleeGenerale: {
        type: Sequelize.STRING
      },
      RepresentantLegaleId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Representant_legales',
          key: 'id'
        }
      },
      page: {
        type: Sequelize.BOOLEAN
      },
      theme:{
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
    await queryInterface.dropTable('Identification_associations');
  }
};