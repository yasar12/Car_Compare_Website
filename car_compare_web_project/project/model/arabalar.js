const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;


const Cars = sequelize.define('Cars', {
  id: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // optional, if the ID is auto-incrementing
  },
  marka: {
      type: DataTypes.TEXT,
      allowNull: false
  },
  model: {
      type: DataTypes.TEXT,
      allowNull: false
  }
}, {
  tableName: 'Cars', // Specify your table name if different from 'Cars'
  timestamps: false  // Disable timestamps if not needed
});

module.exports = Cars;