const express = require("express");
const route = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const userrepository = require("../repositories/userRepository");
const axios = require('axios');

function errorHandler(err, req, res, next) {
    console.error('Error Middleware:', err.stack);
    res.status(err.status || 500).send({ error: err.message || 'Internal Server Error' });
}


route.use(express.json()); 
route.use(express.urlencoded({ extended: true })); 
route.use(cookieParser());

route.get("/", async (req, res, next) => {
   
});

route.use(async (req, res, next) => {
    if (!req.cookies.visited)
       {
      await userrepository.increaseVisitorCount();
      res.cookie('visited', true, { maxAge: 24 * 60 * 60 * 1000 });
      console.log("Ziyaretçi sayısı artırıldı.");
       }
       else
       {
        console.log("Ziyaretçi sayısı artırılmadı.");
       }
next();
  });




  //ana sayfayı yükler
route.get("/car_compare", async (req, res, next) => {
    try {
       
        const cars = await userrepository.getMarkalar();
        const comparisonData = await userrepository.İstatistik_Getir();
        
        res.render("index", { brands: cars, modeller: ['empty'],params:comparisonData});

    } catch (error) {
        next(error); 
    }
});
//Seçilmiş arabaları resultgpt/get sayfasına yönlendirir
route.post("/car_compare", async (req, res, next) => {
    try {
        const { marka } = req.body; 
        

        
        const modellerr = await userrepository.getModeller(marka); 
        

       await userrepository.getmostcompared();
        res.json({ modeller: modellerr });
    } catch (error) {
        next(error); 
    }
});


//Seçilen arabaların sonuçlarının görüntülendiği kısım
route.get('/car_compare/resultgpt', async (req, res,next) => {
    
    try {
       
        var { marka1, model1, marka2, model2 } = req.query;

        var carSpec1 = await userrepository.getmodelid(model1);
        var carSpec2 = await userrepository.getmodelid(model2);
        var carDetails1=null;
        var carDetails2=null;
        var car1=null;
        var car2=null;
        var features=null;
        if (carSpec1 === null || carSpec2 === null) {
            console.log("Geçerli bir araba modeli bulunamadı. Devam ediliyor...");
          } else {
        carDetails1 = await userrepository.getCarsByIds(carSpec1);
        carDetails2 = await userrepository.getCarsByIds(carSpec2);

        
        car1 = carDetails1[0];
        car2 = carDetails2[0];
        await userrepository.send_compared_cars(model1,model2);

        features = [
            { key: 'year', name: 'Year' },
            { key: 'price', name: 'Price' },
            { key: 'horsepower', name: 'Horsepower' },
            { key: 'weight', name: 'Weight' },
            { key: 'top_speed', name: 'Top Speed' },
            { key: 'drivetrain', name: 'Drivetrain' },
            { key: 'braking', name: 'Braking (m/s²)' },
            { key: 'acceleration', name: 'Acceleration (m/s²)' },
            { key: 'handling', name: 'Handling' },
            { key: 'performance_index', name: 'Performance Index' },
            { key: 'zero_to_sixty', name: '0-60 mph (s)' },
            { key: 'zero_to_hundred', name: '0-100 km/h (s)' },
            { key: 'weight_distribution', name: 'Weight Distribution' },
            { key: 'plb_ratio', name: 'Power-to-Weight Ratio' },
            { key: 'group_type', name: 'Group Type' }
        ];
          }
       
        
       
        res.render('resultgpt', {
            carname1: `${marka1} ${model1}`,
            carname2: `${marka2} ${model2}`,
            car1: car1,
            car2: car2,
            features: features

        });
    } catch (error) {
        next(error); 
    }


});



route.post('/car_compare/resultgpt', async (req, res, next) => {
    try {
        console.log(req.body);
        const arabalar = req.body;

        const car1 = arabalar.model1;
        const car2 = arabalar.model2;
        console.log(car1,car2);
        await userrepository.send_compared_cars(car1,car2);
        const carfull1 = arabalar.marka ;
        const carfull2 = arabalar.marka ;

        res.redirect(`/car_compare/resultgpt?carname1=${carfull1}&carname2=${carfull2}`);
    } catch (error) {
        next(error); 
    }
});




route.use(errorHandler);

module.exports = route;
