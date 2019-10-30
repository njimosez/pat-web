'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uniqueId: DataTypes.STRING,
    projectUrl: DataTypes.STRING,
    projectName: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};