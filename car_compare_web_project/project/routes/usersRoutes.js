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
        

       
        res.json({ modeller: modellerr });
    } catch (error) {
        next(error); 
    }
});

route.post('/car_compare/result', async (req, res, next) => {
    try {
        const arabalar = req.body;

        const car1 = arabalar.model1;
        const car2 = arabalar.model2;

        const carfull1 = arabalar.marka + " " + car1;
        const carfull2 = arabalar.marka + " " + car2;

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

      
       
        res.render('result', {
            carname1: `${marka1} ${model1}`,
            carname2: `${marka2} ${model2}`,
            car1: car1,
            car2: car2
        });
    } catch (error) {
        next(error); 
    }
});


route.use(errorHandler);

module.exports = route;
