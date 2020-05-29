"use strict";
module.exports = (sequelize, DataTypes) => {
  const Command = sequelize.define('Command', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueNumberPerDay"
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      unique: "uniqueNumberPerDay"
    },
    take: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    done: {
      type: DataTypes.DATE
    },
    give: {
      type: DataTypes.DATE
    },
    WIP: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    error: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: "Commands"
  });
  Command.associate = function(models) {
    // associations can be defined here
    Command.belongsTo(models.User, {
      as: "client"
    });
    Command.belongsTo(models.User, {
      as: "pc"
    });
    Command.belongsTo(models.User, {
      as: "sandwich"
    });
    Command.belongsTo(models.Dish);
    Command.belongsToMany(models.Ingredient, {
      through: "CommandsIngredients"
    });
    Command.belongsToMany(models.Sauce, {
      through: "CommandsSauces"
    });
    Command.belongsTo(models.Drink);
    Command.belongsTo(models.Dessert);
  };
  return Command;
};
