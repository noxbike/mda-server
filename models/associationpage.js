'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssociationPage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.AssociationPage.belongsTo(models.Identification_association,{
        foreignKey: 'IdentificationAssociationId'
      })
    }
  };
  AssociationPage.init({
    IdentificationAssociationId: DataTypes.INTEGER,
    theme: DataTypes.STRING,
    lien: DataTypes.STRING,
    email: DataTypes.STRING,
    photo: DataTypes.JSON,
    slogan: DataTypes.TEXT,
    histoire: DataTypes.TEXT,
    map: DataTypes.STRING,
    social: DataTypes.JSON,
    contact: DataTypes.JSON,
    logo: DataTypes.STRING,
    personne: DataTypes.JSON,
    mission: DataTypes.JSON,
    show: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AssociationPage',
  });
  return AssociationPage;
};