'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dessert = sequelize.define('Dessert', {
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
    tableName: "Desserts"
  });
  Dessert.associate = function(models) {
    // associations can be defined here
    Dessert.hasMany(models.Command);
  };
  return Dessert;
};