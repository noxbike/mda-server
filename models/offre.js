'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Offre.init({
    titre: DataTypes.STRING,
    description: DataTypes.STRING,
    photo: DataTypes.STRING,
    location: DataTypes.STRING,
    contenu: DataTypes.STRING,
    theme: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Offre',
  });
  return Offre;
};