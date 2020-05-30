"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    passwordHash: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "userFullName"
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "userFullName"
    }
  }, {
    tableName: "Users"
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
