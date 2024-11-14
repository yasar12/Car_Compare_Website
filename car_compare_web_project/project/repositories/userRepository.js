const { connectDB } = require('../config/database');


const Kullanici_ekle = async () => {
  await connectDB(); 

 
  

 
};

const Kullanici_sorgula= async () => {
    await connectDB(); 
  
  
    
  };

  const MarkaVeModel_Getir = async () => {
    try {
      // Markalara göre gruplanmış modelleri al
      const cars = await Car.findAll({
        attributes: [
          'marka', // Marka ismini al
          [Sequelize.fn('GROUP_CONCAT', Sequelize.col('model')), 'modeller'] // Aynı markaya ait modelleri birleştir
        ],
        group: ['marka'], // Marka adına göre grupla
      });
  
      // Veriyi döndür
      return cars;
    } catch (error) {
      console.error('Veritabanı sorgusu sırasında hata:', error);
    }
  };

  const İstatistik_Getir= async () => {
    await connectDB(); 
  
  
    
  };

