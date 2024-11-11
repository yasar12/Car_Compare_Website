const { Pool } = require('pg');  // pg modülünden Pool sınıfını import ediyoruz
const config = require('./config');  // config.js dosyasını içe aktarıyoruz

// Yeni bir havuz (pool) oluşturuyoruz
const pool = new Pool(config.database);

// Veritabanına bağlanma işlemini bir helper olarak yazıyoruz
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

// Sorguları çalıştırmak için fonksiyon
const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = {
    query,   // Sorgu fonksiyonunu dışa aktar
    pool     // Havuz bağlantısını dışa aktar (isteğe bağlı)
};