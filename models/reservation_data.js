'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Reservation_data.init({
    association: DataTypes.STRING,
    email: DataTypes.STRING,
    nbrPerson: DataTypes.STRING,
    calendarId: DataTypes.STRING,
    telephone: DataTypes.STRING,
    description: DataTypes.STRING,
    end: DataTypes.DATE,
    start: DataTypes.DATE,
    statut: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reservation_data',
  });
  return Reservation_data;
};