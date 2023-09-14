'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetails.belongsTo(models.Orders, { foreignKey: 'OrderID'});
      OrderDetails.belongsTo(models.Products, { foreignKey: 'ProductID'});
    }
  }
  OrderDetails.init({
    OrderID: DataTypes.INTEGER,
    ProductID: DataTypes.INTEGER,
    Quantity: DataTypes.INTEGER,
    UnitPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'OrderDetails',
  });
  return OrderDetails;
};