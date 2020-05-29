"use strict";
module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    avoidIngredients: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    avoidSauces: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: "Dishes"
  });
  Dish.associate = function(models) {
    Dish.hasMany(models.Command);
  };
  return Dish;
};
