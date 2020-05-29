"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sauce = sequelize.define('Sauce', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    tableName: "Sauces"
  });
  Sauce.associate = function(models) {
    // associations can be defined here
    Sauce.belongsToMany(models.Command, {
      through: "CommandsSauces"
    });
  };
  return Sauce;
};
