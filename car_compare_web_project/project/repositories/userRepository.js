const { connectDB } = require('../config/database');
const  Cars = require('../model/arabalar'); 
const  teknik = require('../model/teknik_özellikler'); 
const  compare_scored = require('../model/Compared_cars');
const  visitor_history = require('../model/ziyaretci_gecmisi');
const { DataTypes, or } = require('sequelize');
const sequelize = require('../config/database').sequelize;
const { Op } = require('sequelize');



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
      attributes: ['id'], // Yalnızca id alanını alıyoruz
      where: { model: model1 }, // Belirli bir modele ait veriyi almak
      raw: true, // Sadece veri almak için raw true kullanıyoruz
    });

    // Eğer model bulunduysa, id'yi döndürüyoruz
    if (car) {
      return car.id;
    } else {
      console.warn(`Geçersiz model: ${model1}`);
      return null; // Geçersiz modelde null döndür
    }
  } catch (error) {
    console.error(`${model1} modeli için id alınırken hata oluştu:`, error);
    return null; // Hata durumunda null döndür
  }
};



  const getCarsByIds = async(id1)=> {
    try {
        const cars = await teknik.findAll({
            where: {carid:id1},
                raw :true,
                
            
        });
        return cars;
    } catch (error) {
        console.error('Veritabanı hatası:', error);
    }
}

const getCarsByIdsname = async(id1)=> {
  try {
      const cars = await Cars.findAll({
        attributes: ['marka','model'],
          where: {id:id1},
              raw :true,
              
          
      });
      return cars;
  } catch (error) {
      console.error('Veritabanı hatası:', error);
  }
}

const send_compared_cars = async (model1,model2) => {
    try {
        const car1 = await getmodelid(model1);
        const car2 = await getmodelid(model2);
        const  value=await compare_scored.findOne(
           // Güncellenecek alanlar
          {
            attributes: ['compare_score'],
            where: {
              [Op.or]: [
                { first_car_id: car1, second_car_id: car2},
                { first_car_id: car2, second_car_id: car1},
              ],
            },
          }
        );

      
       if (value === null) {
        await compare_scored.create({
          first_car_id: car1,
          second_car_id: car2,
          compare_score: 1
        })
       }
        await compare_scored.update(
          { compare_score: parseInt(value.compare_score)+1 }, // Güncellenecek alanlar
          {
            where: {
              [Op.or]: [
                { first_car_id: car1, second_car_id: car2},
                { first_car_id: car2, second_car_id: car1},
              ],
            },
          }
        );
      
        
      



    } catch (error) {
        console.error('Veritabanı hatası:', error);
    }
}
  
async function getmostcompared() {
  try {
    const valuess = await compare_scored.findAll({
      attributes: ['first_car_id', 'second_car_id'],
      limit: 4,
    });

    const Arabalar = [];
    
    for (const value of valuess) {
      
        const [araba1, araba2] = await Promise.all([
        getCarsByIdsname(value.first_car_id),
        getCarsByIdsname(value.second_car_id),
      ]);
      if (araba1.length !== 0) {
        Arabalar.push(araba1);
      } 
        if( araba2.length !== 0) {    
      Arabalar.push(araba2);
    }
      
    }

for (let i = 0; i < Arabalar.length; i++) {
  for (let j = 0; j < Arabalar[i].length; j++) {
    console.log(Arabalar[i][j]);
  }
}
    
  } catch (error) {
    console.error('Error fetching car details:', error);
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


const increaseVisitorCount = async () => {
  const today = new Date();
  try {
    // Ziyaretçi sayısını 1 artırıyoruz
    const [siteStats, created] = await visitor_history.findOrCreate({
      where: { tarih: today.toISOString().split('T')[0] },
      defaults: { ziyaret_sayisi: 0 }
    });

    siteStats.ziyaret_sayisi += 1;
    await siteStats.save();
    console.log(`Ziyaretçi sayısı başarıyla güncellendi: ${siteStats.visitor_count}`);
  } catch (error) {
    console.error("Ziyaretçi sayısı artırılırken hata oluştu:", error);
  }
};


async function getVisitorCountBetweenDates(startDate, endDate) {
  var toplamZiyaretci;
  try {
    
    if(startDate!==endDate){
      toplamZiyaretci = await visitor_history.sum('ziyaret_sayisi', {
          where: {
              tarih: {
                  [Op.between]: [startDate, endDate]
              }
          }
      });
      console.log(toplamZiyaretci);
    }
    
    else if(startDate===endDate){
      toplamZiyaretci = await visitor_history.findOne({
        attributes: ['ziyaret_sayisi'],  // Sadece ziyaret_sayisi sütununu seçiyoruz
        where: {
            tarih: startDate // startDate'e göre filtreleme yapıyoruz
        }
    });
    
return toplamZiyaretci.ziyaret_sayisi ;
    }
      
    return toplamZiyaretci ;
  } catch (error) {
      console.error('Hata: Ziyaretçi sayısı sorgusu sırasında bir sorun oluştu.', error);
      throw new Error('Veritabanı hatası.');
  }
}



//karşılaştırılan arabaların istatistiklerini getiren method
  const İstatistik_Getir= async () => {   
    try {
      const topComparisons = await compare_scored.findAll({
          attributes: [
              'first_car_id',
              'second_car_id',
              'compare_score',
              [sequelize.fn('SUM', sequelize.col('compare_score')), 'total_score']
          ],
          group: ['first_car_id', 'second_car_id','compare_score'],
          order: [[sequelize.literal('total_score'), 'DESC']],
          limit: 5
      });
      
    // Çiftleri saklayacak boş dizi

      // comparisonData'yı dolaşarak çiftleri oluşturuyoruz
      const pairs = await Promise.all(
        topComparisons.map(async (comparison) => {
            const firstCarResult = await getCarsByIdsname(comparison.first_car_id);
            const secondCarResult = await getCarsByIdsname(comparison.second_car_id);
    
            return {
                firstCar: firstCarResult[0], // Diziden ilk objeyi alıyoruz
                secondCar: secondCarResult[0],
                scoree: comparison.compare_score[0]
            };
        })
    );
    
      return pairs;


  } catch (error) {
      console.error("En çok karşılaştırılanlar hatası:", error);
   
  }
  
    
  };

  const Toplam_Karsilastirma_Miktari= async () => {
    
  try{
      const totalComparisons = await compare_scored.sum('compare_score'); // compare_score sütunundaki toplamı alır
    
      return totalComparisons;
     }  
     
     catch (error) {
      console.error("Toplam karşılaştırma hatası:", error);
     
    }
  
  };



module.exports = {
    
    getMarkalar,
    getModeller,
    getmodelid,
    getCarsByIds,
    İstatistik_Getir,
    send_compared_cars,
    getmostcompared,
    Toplam_Karsilastirma_Miktari,
    İstatistik_Getir,
    increaseVisitorCount,
    getVisitorCountBetweenDates
  };