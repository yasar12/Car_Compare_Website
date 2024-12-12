const express = require("express");
const route = express.Router();
const path = require('path');
const userrepository = require("../repositories/userRepository");


function errorHandler(err, req, res, next) {
    console.error('Error Middleware:', err.stack);
    res.status(err.status || 500).send({ error: err.message || 'Internal Server Error' });
}


route.use(express.json()); 
route.use(express.urlencoded({ extended: true })); 


route.get("/car_compare", async (req, res, next) => {
    try {
       
        const cars = await userrepository.getMarkalar();
       

        res.render("index", { brands: cars, modeller: ['empty'] });

    } catch (error) {
        next(error); 
    }
});

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

route.post('/car_compare/result', async (req, res, next) => {
    try {
        console.log(req.body);
        const arabalar = req.body;

        const car1 = arabalar.model1;
        const car2 = arabalar.model2;
        console.log(car1,car2);
        await userrepository.send_compared_cars(car1,car2);
        const carfull1 = arabalar.marka ;
        const carfull2 = arabalar.marka ;

        res.redirect(`/car_compare/result?carname1=${carfull1}&carname2=${carfull2}`);
    } catch (error) {
        next(error); 
    }
});

route.get('/car_compare/result', async (req, res, next) => {
    try {
       
        const { marka1, model1, marka2, model2 } = req.query;

        const carSpec1 = await userrepository.getmodelid(model1);
        const carSpec2 = await userrepository.getmodelid(model2);

        const carDetails1 = await userrepository.getCarsByIds(carSpec1);
        const carDetails2 = await userrepository.getCarsByIds(carSpec2);

        
        const car1 = carDetails1[0];
        const car2 = carDetails2[0];
        await userrepository.send_compared_cars(model1,model2);
        const features = [
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
       
        res.render('result', {
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


route.use(errorHandler);

module.exports = route;
