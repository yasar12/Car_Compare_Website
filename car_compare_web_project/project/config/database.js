const { Sequelize } = require('sequelize');

// PostgreSQL bağlantı bilgileri
const sequelize = new Sequelize('postgres', 'postgres', '1', {
  host: 'localhost', // Sunucu
  dialect: 'postgres', // Veritabanı türü
  logging: false, // Sorguları konsolda yazdırmamayı sağlar
});

const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Bağlantıyı doğrula
    console.log('PostgreSQL veritabanına başarıyla bağlandı!');
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
  }
};

// Bağlantıyı dışa aktar
module.exports = {
  sequelize,
  connectDB
};
