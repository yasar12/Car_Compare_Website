const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;


const Most_Compares = sequelize.define('Most_Compares', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
},
  first_car_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    
  },
  second_car_id: {
      type: DataTypes.BIGINT,
      allowNull: false
  },
 compare_score: {
      type: DataTypes.BIGINT,
      allowNull: false
  }
}, {
  tableName: 'Most_Compares', // Specify your table name if different from 'Cars'
  timestamps: false  // Disable timestamps if not needed
});

module.exports = Most_Compares;