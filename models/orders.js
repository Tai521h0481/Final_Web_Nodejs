'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orders.belongsTo(models.Customers, { foreignKey: 'CustomerID'});
      Orders.belongsTo(models.Users, { foreignKey: 'UserID'});
      Orders.hasMany(models.OrderDetails, { foreignKey: 'OrderID'});
    }
  }
  Orders.init({
    UserID: DataTypes.INTEGER,
    CustomerID: DataTypes.INTEGER,
    TotalAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};