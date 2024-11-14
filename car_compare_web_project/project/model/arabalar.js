const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Car = sequelize.define('Cars', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    marka: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  module.exports = Car;