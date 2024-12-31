const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;



const VisitorCount = sequelize.define('Ziyaretci_gecmisi', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tarih: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ziyaret_sayisi: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Ziyaretci_gecmisi', // Veritabanındaki tablo adı
    timestamps: false // createdAt ve updatedAt sütunları eklenmeyecek
});


module.exports = VisitorCount;