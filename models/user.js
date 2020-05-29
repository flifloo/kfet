"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "Users"
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Command, {
      as: "client"
    });
    User.hasMany(models.Command, {
      as: "pc"
    });
    User.hasMany(models.Command, {
      as: "sandwich"
    })
  };
  return User;
};
