"use strict";
module.exports = (sequelize, DataTypes) => {
  const Drink = sequelize.define('Drink', {
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    tableName: "Drinks"
  });
  Drink.associate = function(models) {
    // associations can be defined here
    Drink.hasMany(models.Command);
  };
  return Drink;
};
