"use strict";
module.exports = (sequelize, DataTypes) => {
  const Command = sequelize.define('Command', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false
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
      as: "command"
    });
    Command.belongsTo(models.User, {
      as: "pcCommand"
    });
    Command.belongsTo(models.User, {
      as: "sandwichCommand"
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
