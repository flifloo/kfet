"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      set(value) {
        if (value)
          this.setDataValue("passwordHash", require("crypto").createHash("sha256").update(this.username + value).digest("base64"));
      }
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
