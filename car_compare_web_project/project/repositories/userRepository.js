const { connectDB } = require('../config/database');
const  Cars = require('../model/arabalar'); 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Kullanici_ekle = async () => {
  await connectDB(); 

 
  

 
};

const Kullanici_sorgula= async () => {
    await connectDB(); 
  
  
    
  };

  // Marka isimlerini getir sorgusu
const getMarkalar = async () => {
  try {
    const markalar = await Cars.findAll({
      attributes: ['marka'],  // Yalnızca marka alanını alıyoruz
      group: ['marka'],  // Markaları gruplamak (eşsiz markalar)
      raw: true,  // Raw veriyi alıyoruz
    });

    // Sadece marka isimlerini içeren bir dizi döndür
    return markalar.map(car => car.marka);  // "marka" alanını alıyoruz
  } catch (error) {
    console.error('Markalar alınırken hata oluştu:', error);
    throw error;
  }
};


const getmodelid = async (model) => {
  try {
    const car = await Cars.findOne({
      attributes: ['id'],  // Yalnızca id alanını alıyoruz
      where: { model: model },  // Belirli bir modele ait veriyi almak
      raw: true,  // Sadece veri almak için raw true kullanıyoruz
    });
    
    // Eğer model bulunduysa, id'yi döndürüyoruz
    if (car) {
      return car.id;
    } else {
      throw new Error(`Model ${model} bulunamadı`);
    }
  } catch (error) {
    console.error(`${model} modeli için id alınırken hata oluştu:`, error);
    throw error;
  }
};

const getCarsByIds = async (carId1, carId2) => {
  try {
    // Birden fazla araba ID'sine göre arabaların verilerini alıyoruz
    const cars = await Cars.findAll({
      where: {
        id: { 
          [sequelize.Op.in]: [carId1, carId2]  // ID'ler arasında carId1 ve carId2 olan arabaları getiriyoruz
        }
      },
      raw: true,  // Veriyi sade bir nesne olarak almak için raw true kullanıyoruz
    });

    // Eğer arabalar bulunduysa, her iki arabanın verisini döndürüyoruz
    if (cars.length === 2) {
      return {
        car1: cars[0],  // İlk araba verisi
        car2: cars[1]   // İkinci araba verisi
      };
    } else {
      throw new Error(`ID'leri ${carId1} ve ${carId2} olan arabalar bulunamadı veya eksik.`);
    }
  } catch (error) {
    console.error(`ID'leri ${carId1} ve ${carId2} olan arabalar alınırken hata oluştu:`, error);
    throw error;
  }
};



  


const getModeller = async (marka) => {
  try {
    const modeller = await Cars.findAll({
      attributes: ['model'],  // Yalnızca model alanını alıyoruz
      where: { marka: marka },  // Belirli bir markaya ait modelleri almak
      raw: true,  // Sadece veri almak için raw true kullanıyoruz
    });
    
    return modeller.map(car => car.model);  // "model" alanını döndürüyoruz
  } catch (error) {
    console.error(`${marka} markası için modeller alınırken hata oluştu:`, error);
    throw error;
  }
};


  const İstatistik_Getir= async () => {
    await connectDB(); 
  
  
    
  };

module.exports = {
    Kullanici_ekle,
    Kullanici_sorgula,
    getMarkalar,
    getModeller,
    getmodelid,
    getCarsByIds,
    İstatistik_Getir
  };