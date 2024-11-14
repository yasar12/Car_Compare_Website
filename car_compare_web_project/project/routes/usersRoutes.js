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
       const {car1,cars2} = await userrepository.getCarsByIds( await userrepository.getmodelid(arabalar.model1), await userrepository.getmodelid(arabalar.model2))
        res.render('result', {  cars:arabalar });

    } catch (error) {
        console.error('Karşılaştırma sırasında hata oluştu:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = route;





