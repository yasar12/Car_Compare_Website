const { connectDB } = require('../config/database');
const  Cars = require('../model/arabalar'); 
const  teknik = require('../model/teknik_özellikler'); 
const  compare_scored = require('../model/Compared_cars');
const  visitor_history = require('../model/ziyaretci_gecmisi');
const { DataTypes, or } = require('sequelize');
const sequelize = require('../config/database').sequelize;
const { Op } = require('sequelize');



// İstatistik verilerini getirir.
const İstatistik_Getir = async () => {   
    try {
        const topComparisons = await compare_scored.findAll({
            attributes: [
                'first_car_id',
                'second_car_id',
                'compare_score',
                [sequelize.fn('SUM', sequelize.col('compare_score')), 'total_score']
            ],
            group: ['first_car_id', 'second_car_id', 'compare_score'],
            order: [[sequelize.literal('total_score'), 'DESC']],
            limit: 5
        });
  
        // Eğer veri bulunamadıysa boş bir dizi döndür
        if (!topComparisons || topComparisons.length === 0) {
            console.warn("Veritabanında herhangi bir karşılaştırma verisi bulunamadı.");
            return [];
        }
  
        // Gelen veri 5'ten az ise kullanıcıya bilgi ver
        if (topComparisons.length < 5) {
            console.warn(`Sadece ${topComparisons.length} adet karşılaştırma verisi bulundu.`);
        }
  
        // Çiftleri saklayacak boş dizi
        const pairs = await Promise.all(
            topComparisons.map(async (comparison) => {
                const firstCarResult = await getCarsByIdsname(comparison.first_car_id);
                const secondCarResult = await getCarsByIdsname(comparison.second_car_id);
                
                // Eğer herhangi bir araba bilgisi bulunamazsa default bir mesaj oluştur
                const firstCar = firstCarResult[0] || { marka: 'Bilinmiyor', model: 'Bilinmiyor' };
                const secondCar = secondCarResult[0] || { marka: 'Bilinmiyor', model: 'Bilinmiyor' };
  
                return {
                    firstCar,
                    secondCar,
                    scoree: comparison.compare_score || 0 // Eğer score yoksa 0 olarak kabul et
                };
            })
        );
  
        return pairs;
  
    } catch (error) {
        console.error("En çok karşılaştırılanlar hatası:", error);
        return []; // Hata durumunda boş bir dizi döndür
    }
  };
  // Belirtilen tarih aralığındaki istatistikleri getirir.
  const aralikli_İstatistik_Getir = async (startDate, endDate, mode) => {
    try {
        if (mode === 'yearly') {
            const yearlyData = await compare_scored.findAll({
                attributes: [
                    [sequelize.literal('EXTRACT(YEAR FROM "date")'), 'year'], // Yılı çıkar
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total_comparisons'] // Toplam karşılaştırma sayısı
                ],
                where: {
                    date: {
                        [Op.between]: [startDate, endDate] // Tarih aralığı
                    }
                },
                group: [sequelize.literal('EXTRACT(YEAR FROM "date")')], // Yıla göre gruplama
                order: [[sequelize.literal('EXTRACT(YEAR FROM "date")'), 'ASC']] // Yıla göre sıralama
            });
  
            return yearlyData.map((data) => ({
                year: data.dataValues.year,
                totalComparisons: parseInt(data.dataValues.total_comparisons, 10)
            }));
        } else if (mode === 'monthly') {
            const monthlyData = await compare_scored.findAll({
                attributes: [
                    [sequelize.literal('EXTRACT(YEAR FROM "date")'), 'year'], // Yılı çıkar
                    [sequelize.literal('EXTRACT(MONTH FROM "date")'), 'month'], // Ayı çıkar
                    [sequelize.fn('SUM', sequelize.col('compare_score')), 'total_score'] // Toplam skor
                ],
                where: {
                    date: {
                        [Op.between]: [startDate, endDate] // Tarih aralığı
                    }
                },
                group: [
                    sequelize.literal('EXTRACT(YEAR FROM "date")'),
                    sequelize.literal('EXTRACT(MONTH FROM "date")')
                ], // Yıl ve aya göre gruplama
                order: [
                    [sequelize.literal('EXTRACT(YEAR FROM "date")'), 'ASC'], // Yıla göre sıralama
                    [sequelize.literal('EXTRACT(MONTH FROM "date")'), 'ASC'] // Aya göre sıralama
                ]
            });
  
            return monthlyData.map((data) => ({
                year: data.dataValues.year,
                month: data.dataValues.month,
                totalScore: parseInt(data.dataValues.total_score, 10)
            }));
        } else {
            throw new Error("Geçersiz mod seçildi. 'yearly' veya 'monthly' seçmelisiniz.");
        }
    } catch (error) {
        console.error("İstatistikleri getirirken hata oluştu:", error);
        return [];
    }
  };
  // Ziyaretçi istatistiklerini belirtilen tarih aralığına göre getirir.
  const ziyaretci_İstatistik_Getirr = async (startDate, endDate, mode) => {
    let data;
  
      if (!startDate || !endDate) {
          throw new Error('Başlangıç ve bitiş tarihleri sağlanmalıdır.');
      }
  
      if (mode === 'daily') {
          // Günlük veriler
          data = await visitor_history.findAll({
              attributes: [
                  [sequelize.fn('DATE', sequelize.col('tarih')), 'date'],
                  [sequelize.fn('SUM', sequelize.col('ziyaret_sayisi')), 'visitorCount'] // ziyaret_sayisi toplama işlemi
              ],
              where: {
                  tarih: {
                      [Op.between]: [startDate, endDate]
                  }
              },
              group: ['date'],
              order: [[sequelize.col('date'), 'ASC']],
              limit: 7 // Maksimum 7 gün
          });
      } else if (mode === 'monthly') {
          // Aylık veriler
          data = await visitor_history.findAll({
              attributes: [
                  [sequelize.literal('EXTRACT(YEAR FROM "tarih")'), 'year'], // Yıl
                  [sequelize.literal('EXTRACT(MONTH FROM "tarih")'), 'month'], // Ay
                  [sequelize.fn('SUM', sequelize.col('ziyaret_sayisi')), 'visitorCount'] // ziyaret_sayisi toplama işlemi
              ],
              where: {
                  tarih: {
                      [Op.between]: [startDate, endDate]
                  }
              },
              group: ['year', 'month'],
              order: [[sequelize.literal('year'), 'ASC'], [sequelize.literal('month'), 'ASC']],
              limit: 12 // Maksimum 12 ay
          });
      } else if (mode === 'yearly') {
          // Yıllık veriler
          data = await visitor_history.findAll({
              attributes: [
                  [sequelize.literal('EXTRACT(YEAR FROM "tarih")'), 'year'], // Yıl
                  [sequelize.fn('SUM', sequelize.col('ziyaret_sayisi')), 'visitorCount'] // ziyaret_sayisi toplama işlemi
              ],
              where: {
                  tarih: {
                      [Op.between]: [startDate, endDate]
                  }
              },
              group: ['year'],
              order: [[sequelize.literal('year'), 'ASC']],
              limit: 10 // Maksimum 10 yıl
          });
      } else {
          throw new Error("Geçersiz mod. 'daily', 'monthly', veya 'yearly' olmalı.");
      }
  
      return data.map(row => row.dataValues);
  };
  // Toplam karşılaştırma miktarını getirir.
    const Toplam_Karsilastirma_Miktari= async () => {
      
    try{
        const totalComparisons = await compare_scored.sum('compare_score'); // compare_score sütunundaki toplamı alır
      
        return totalComparisons;
       }  
       
       catch (error) {
        console.error("Toplam karşılaştırma hatası:", error);
       
      }
    
    };
  
// Mevcut markaların listesini getirir.
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
      
      // Verilen model adına göre model bilgilerini getirir.
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
      
      
      // Verilen ID'lere göre araçları getirir.
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
      // Belirtilen araç adlarına göre araçları getirir.
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
      // İki araç modelini karşılaştırmak üzere gönderir.
      const send_compared_cars = async (model1, model2) => {
        try {
            const car1 = await getmodelid(model1);
            const car2 = await getmodelid(model2);
            const now = new Date();
            const turkeyTime = new Date(now.getTime() + (3 * 60 - now.getTimezoneOffset()) * 60000);
            const today = turkeyTime.toISOString().split('T')[0];
      
          console.log(today);
      
            console.log(today);
            // Bugüne ait kaydı bulun
            const value = await compare_scored.findOne({
                attributes: ['compare_score'],
                where: {
                    [Op.and]: [
                        { date: today }, // Bugün tarihi kontrolü
                        {
                            [Op.or]: [
                                { first_car_id: car1, second_car_id: car2 },
                                { first_car_id: car2, second_car_id: car1 },
                            ],
                        },
                    ],
                },
            });
      
            if (value === null) {
                // Eğer bugüne ait kayıt yoksa yeni kayıt oluştur
                await compare_scored.create({
                    first_car_id: car1,
                    second_car_id: car2,
                    compare_score: 1,
                    date: today, // Tarih alanını ekleyin
                });
            } else {
                // Eğer bugüne ait kayıt varsa score'u artır
                await compare_scored.update(
                    { compare_score: parseInt(value.compare_score) + 1 },
                    {
                        where: {
                            [Op.and]: [
                                { date: today },
                                {
                                    [Op.or]: [
                                        { first_car_id: car1, second_car_id: car2 },
                                        { first_car_id: car2, second_car_id: car1 },
                                    ],
                                },
                            ],
                        },
                    }
                );
            }
        } catch (error) {
            console.error('Veritabanı hatası:', error);
        }
      };
      
        // Karşılaştırma sayısına göre en popüler araçları getirir.
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
      // Verilen markaya göre araçları getirir.
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
      



      module.exports = {
    
        getMarkalar,
        getModeller,
        getmodelid,
        getCarsByIds,
        İstatistik_Getir,
        send_compared_cars,
        getmostcompared,
        Toplam_Karsilastirma_Miktari,
        aralikli_İstatistik_Getir,
        ziyaretci_İstatistik_Getirr,
        İstatistik_Getir,
        
        
      };