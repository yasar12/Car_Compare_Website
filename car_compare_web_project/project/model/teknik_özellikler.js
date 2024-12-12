const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const TechnicalSpecification = sequelize.define('technicalspecification', {
   carid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    year: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    horsepower: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    top_speed: DataTypes.DECIMAL(5,2),
    drivetrain: DataTypes.STRING(10),
    braking: DataTypes.DECIMAL(6,2),
    acceleration: DataTypes.DECIMAL(6,2),
    handling: DataTypes.DECIMAL(6,2),
    performance_index: DataTypes.DECIMAL(6,2),
    zero_to_sixty: DataTypes.DECIMAL(6,2),
    zero_to_hundred: DataTypes.DECIMAL(6,2),
    weight_distribution: DataTypes.STRING(10),
    plb_ratio: DataTypes.DECIMAL(6,2),
    release_date: DataTypes.DATE,
    group_type: DataTypes.STRING(50)
}, {
tableName: 'technicalspecification', // Replace with your actual table name if different
timestamps: false // Set this based on whether your table tracks created/updated times
});
  
  module.exports = TechnicalSpecification;
  
