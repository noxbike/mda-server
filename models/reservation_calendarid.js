'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation_calendarId extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Reservation_calendarId.init({
    name: DataTypes.STRING,
    calendarId: DataTypes.STRING,
    nbrPerson: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reservation_calendarId',
  });
  return Reservation_calendarId;
};