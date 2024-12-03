const express = require("express");
const route = express.Router();
const path = require('path');
const userrepository = require("../repositories/userRepository");
route.use(express.json());  // JSON verisi için
route.use(express.urlencoded({ extended: true })); 




route.get("/car_compare", async (req, res) => {
    try {
      // Marka ve modelleri al
      const cars = await userrepository.getMarkalar();
      console.log(cars);
      
      res.render("index", { brands: cars,modeller: ['empty'] });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  
  route.post("/car_compare", async (req, res) => {
    try {
        const { marka } = req.body;  // POST isteği ile gelen marka
        console.log("Gelen Marka:", marka);  // Burada gelen markayı kontrol edebilirsiniz

        // Markaya ait modelleri almak için veritabanı işlemi (örneğin: getModeller)
        const modellerr = await userrepository.getModeller(marka);  // Markaya bağlı modelleri al
        console.log("Modeller:", modellerr);  // Gelen modelleri kontrol edin
        
        // Modelleri JSON formatında döndür
        res.json({ modeller: modellerr });

    } catch (error) {
        console.error('Model alınırken hata oluştu:', error);
        res.status(500).send('Internal Server Error');
    }
});

route.post('/car_compare/result', async (req, res) => {
    try {
        const arabalar = req.body;  // POST ile gelen marka ve model bilgileri      

       const car1=arabalar.model1;
       const car2=arabalar.model2;
       
      
       const carfull1=arabalar.marka+" "+car1
       const carfull2=arabalar.marka+" "+car1
      
       res.redirect(`/car_compare/result?carname1=${carfull1}&carname2=${carfull2}`);

      
      
       
    } catch (error) {
        console.error('Karşılaştırma sırasında hata oluştu:', error);
        res.status(500).send('Internal Server Error');
    }
});

route.get('/car_compare/result', async (req, res) => {
  const { marka1, model1, marka2, model2 } = req.query;

  const carSpec1 = await userrepository.getmodelid(model1);
  const carSpec2 = await userrepository.getmodelid(model2);
  
  const carDetails1 = await userrepository.getCarsByIds(carSpec1);
  const carDetails2 = await userrepository.getCarsByIds(carSpec2);
  
  // carDetails1 ve carDetails2'nin birer dizi olduğunu varsayıyorum
  // Tek bir obje almak için dizi elemanına erişiyoruz
  const car1 = carDetails1[0];
  const car2 = carDetails2[0];
  
  console.log(car1);
  // `result.ejs` şablonuna bu verileri gönderiyoruz
  res.render('result', {
      carname1: `${marka1} ${model1}`,
      carname2: `${marka2} ${model2}`,
      car1: car1,
      car2: car2
  });
  
  

  
});



module.exports = route;





