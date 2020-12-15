'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partenaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Partenaire.init({
    lien: DataTypes.STRING,
    image: DataTypes.STRING,
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Partenaire',
  });
  return Partenaire;
};