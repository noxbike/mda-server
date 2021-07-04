'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gallerie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Gallerie.init({
    name: DataTypes.STRING,
    photo: DataTypes.STRING,
    contenu: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Gallerie',
  });
  return Gallerie;
};