const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TechnicalSpecification = sequelize.define('TechnicalSpecification', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.NUMERIC
    },
    horsepower: {
      type: DataTypes.INTEGER
    },
    weight: {
      type: DataTypes.INTEGER
    },
    top_speed: {
      type: DataTypes.NUMERIC(5, 2)
    },
    drivetrain: {
      type: DataTypes.STRING(10)
    },
    braking: {
      type: DataTypes.NUMERIC(3, 1)
    },
    acceleration: {
      type: DataTypes.NUMERIC(3, 1)
    },
    handling: {
      type: DataTypes.NUMERIC(3, 1)
    },
    performance_index: {
      type: DataTypes.INTEGER
    },
    zero_to_sixty: {
      type: DataTypes.NUMERIC(4, 2)
    },
    zero_to_hundred: {
      type: DataTypes.NUMERIC(4, 2)
    },
    weight_distribution: {
      type: DataTypes.STRING(10)
    },
    plb_ratio: {
      type: DataTypes.NUMERIC(4, 3)
    },
    release_date: {
      type: DataTypes.DATE
    },
    group_type: {
      type: DataTypes.STRING(50)
    }
  });
  
  module.exports = TechnicalSpecification;
  
