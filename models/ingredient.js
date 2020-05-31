"use strict";
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
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
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: "Ingredients"
  });
  Ingredient.associate = function(models) {
    Ingredient.belongsToMany(models.Command, {
      through: "CommandsIngredients"
    });
  };
  return Ingredient;
};
