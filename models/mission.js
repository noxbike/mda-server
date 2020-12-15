'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Mission.init({
    missions: DataTypes.STRING,
    intitule: DataTypes.STRING,
    lien: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Mission',
  });
  return Mission;
};