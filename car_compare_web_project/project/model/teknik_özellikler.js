const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const TechnicalSpecification = sequelize.define('technicalSpecification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    
},
year: {
    type: DataTypes.INTEGER,
    allowNull: true,
},
price: {
    type: DataTypes.NUMERIC,
    allowNull: true,
},
horsepower: {
    type: DataTypes.INTEGER,
    allowNull: true,
},
weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
},
top_speed: {
    type: DataTypes.NUMERIC(5, 2),
    allowNull: true,
},
drivetrain: {
    type: DataTypes.STRING(10),
    allowNull: true,
},
braking: {
    type: DataTypes.NUMERIC(3, 1),
    allowNull: true,
},
acceleration: {
    type: DataTypes.NUMERIC(3, 1),
    allowNull: true,
},
handling: {
    type: DataTypes.NUMERIC(3, 1),
    allowNull: true,
},
performance_index: {
    type: DataTypes.INTEGER,
    allowNull: true,
},
zero_to_sixty: {
    type: DataTypes.NUMERIC(4, 2),
    allowNull: true,
},
zero_to_hundred: {
    type: DataTypes.NUMERIC(4, 2),
    allowNull: true,
},
weight_distribution: {
    type: DataTypes.STRING(10),
    allowNull: true,
},
plb_ratio: {
    type: DataTypes.NUMERIC(4, 3),
    allowNull: true,
},
group_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
}
}, {
tableName: 'technicalSpecification', // Replace with your actual table name if different
timestamps: false // Set this based on whether your table tracks created/updated times
});
  
  module.exports = TechnicalSpecification;
  
