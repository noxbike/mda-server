'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Representant_legale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Representant_legale.hasOne(
        models.Identification_association,
        models.Conseil_administration,
        models.Document_association
      );
    }
  };
  Representant_legale.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    qualite: DataTypes.STRING,
    adresse: DataTypes.STRING,
    telephoneAmb: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Representant_legale',
  });
  return Representant_legale;
};