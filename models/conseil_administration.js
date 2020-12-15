'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conseil_Administration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Conseil_Administration.belongsTo(models.Representant_legale,{
        foreignKey: 'UserId'
      });
    }
  };
  Conseil_Administration.init({
    UserId: DataTypes.INTEGER,
    CompositionBureau: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Conseil_Administration',
  });
  return Conseil_Administration;
};