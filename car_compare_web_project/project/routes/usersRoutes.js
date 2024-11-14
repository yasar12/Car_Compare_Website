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
      
      res.render("index", { brands: cars,modeller: ['i5', 'i7', 'X5'] });
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

route.post('/car_compare/compare', async (req, res) => {
    try {
        const arabalar = req.body;  // POST ile gelen marka ve model bilgileri

        // Gelen verileri konsola yazdırarak kontrol edelim
        console.log(arabalar);
       
        
        // Karşılaştırma sonucu (burada işleme yapılabilir)
        

        // Karşılaştırma sonuçlarını JSON olarak gönderiyoruz
       const car1=arabalar.model1;
       const car2=arabalar.model2;
       
        
      const carspec1=await userrepository.getmodelid(car1)
      const carspec2=await userrepository.getmodelid(car2);
      const carssp1=await userrepository.getCarsByIds(carspec1);
      const carssp2=await userrepository.getCarsByIds(carspec2);
      console.log(await userrepository.getCarsByIds(carspec2));
       const carfull1=arabalar.marka+" "+car1
       const carfull2=arabalar.marka+" "+car1
      res.setHeader('/car_compare/compare');
      res.redirect('/car_compare/compare');
      res.render('result.ejs',{carname1:carfull1,carname2:carfull2,car1:carssp1,car2:carssp2});
      
       
    } catch (error) {
        console.error('Karşılaştırma sırasında hata oluştu:', error);
        res.status(500).send('Internal Server Error');
    }
});

route.get('/car_compare/compare', async (req, res) => {


});
module.exports = route;





