'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userOtp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userOtp.init({
    userId: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    defaultValue:0
  }, {
    sequelize,
    modelName: 'userOtp',
  });
  return userOtp;
};