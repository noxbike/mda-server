'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Agenda.init({
    titre: DataTypes.STRING,
    date: DataTypes.DATE,
    photo: DataTypes.STRING,
    contenu: DataTypes.STRING,
    auteur: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Agenda',
  });
  return Agenda;
};