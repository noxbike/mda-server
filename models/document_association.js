'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document_association extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Document_association.belongsTo(models.Representant_legale,{
        foreignKey: 'UserId'
      });
    }
  };
  Document_association.init({
    UserId: DataTypes.INTEGER,
    Document: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Document_association',
  });
  return Document_association;
};