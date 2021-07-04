'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Identification_association extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Identification_association.hasOne(models.AssociationPage);
      models.Identification_association.belongsTo(models.Representant_legale,{
        foreignKey: 'RepresentantLegaleId'
      });
    }
  };
  Identification_association.init({
    nomAssociation: DataTypes.STRING,
    dateParutionAuJournalOfficiel: DataTypes.STRING,
    sigle: DataTypes.STRING,
    siret: DataTypes.STRING,
    tel: DataTypes.STRING,
    emailAssociation: DataTypes.STRING,
    dateCreation: DataTypes.STRING,
    maldecRna: DataTypes.STRING,
    adresseSiegeSocial: DataTypes.STRING,
    codeApe: DataTypes.STRING,
    numAgrement: DataTypes.STRING,
    Affiliation: DataTypes.STRING,
    derniereAssembleeGenerale: DataTypes.STRING,
    RepresentantLegaleId: DataTypes.INTEGER,
    page: DataTypes.BOOLEAN,
    theme: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Identification_association',
  });
  return Identification_association;
};