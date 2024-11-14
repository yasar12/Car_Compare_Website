const { connectDB } = require('../config/database');
const  Cars = require('../model/arabalar'); 
const  teknik = require('../model/teknik_özellikler'); 
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


const getmodelid = async (model1) => {
  try {
    const car = await Cars.findOne({
      attributes: ['id'],  // Yalnızca id alanını alıyoruz
      where: { model: model1 },  // Belirli bir modele ait veriyi almak
      raw: true,  // Sadece veri almak için raw true kullanıyoruz
    });
    
    // Eğer model bulunduysa, id'yi döndürüyoruz
    if (car) {
      return car.id;
    } else {
      throw new Error(`Model ${model1} bulunamadı`);
    }
  } catch (error) {
    console.error(`${model1} modeli için id alınırken hata oluştu:`, error);
    throw error;
  }
};

  const getCarsByIds = async(id1)=> {
    try {
        const cars = await teknik.findAll({
            where: {id:id1},
                raw :true,
                
            
        });
        return cars;
    } catch (error) {
        console.error('Veritabanı hatası:', error);
    }
}


  


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