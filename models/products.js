'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.hasMany(models.OrderDetails, { foreignKey: 'ProductID'});
    }
  }
  Products.init({
    Barcode: DataTypes.STRING,
    Name: DataTypes.STRING,
    ImportPrice: DataTypes.INTEGER,
    RetailPrice: DataTypes.INTEGER,
    Category: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};