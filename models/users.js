'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Orders, { foreignKey: 'UserID'});
    }
  }
  Users.init({
    Email: DataTypes.STRING,
    Password: DataTypes.STRING,
    Fullname: DataTypes.STRING,
    Role: DataTypes.STRING,
    Profile_Picture: DataTypes.STRING,
    IsActive: DataTypes.BOOLEAN,
    IsLocked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};