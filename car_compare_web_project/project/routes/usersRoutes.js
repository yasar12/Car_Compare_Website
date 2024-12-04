const express = require("express");
const route = express.Router();
const path = require('path');
const userrepository = require("../repositories/userRepository");

// Middleware
// Hata Yönetimi Middleware'i
function errorHandler(err, req, res, next) {
    console.error('Error Middleware:', err.stack);
    res.status(err.status || 500).send({ error: err.message || 'Internal Server Error' });
}

// Global Middleware'ler
route.use(express.json()); // JSON verisi için
route.use(express.urlencoded({ extended: true })); // URL-encoded verisi için

// Rotalar
route.get("/car_compare", async (req, res, next) => {
    try {
        // Marka ve modelleri al
        const cars = await userrepository.getMarkalar();
        console.log(cars);

        res.render("index", { brands: cars, modeller: ['empty'] });
    } catch (error) {
        next(error); // Hata middleware'ine gönder
    }
});

route.post("/car_compare", async (req, res, next) => {
    try {
        const { marka } = req.body; // POST isteği ile gelen marka
        console.log("Gelen Marka:", marka); // Burada gelen markayı kontrol edebilirsiniz

        // Markaya ait modelleri almak için veritabanı işlemi (örneğin: getModeller)
        const modellerr = await userrepository.getModeller(marka); // Markaya bağlı modelleri al
        console.log("Modeller:", modellerr); // Gelen modelleri kontrol edin

        // Modelleri JSON formatında döndür
        res.json({ modeller: modellerr });
    } catch (error) {
        next(error); // Hata middleware'ine gönder
    }
});

route.post('/car_compare/result', async (req, res, next) => {
    try {
        const arabalar = req.body; // POST ile gelen marka ve model bilgileri

        const car1 = arabalar.model1;
        const car2 = arabalar.model2;

        const carfull1 = arabalar.marka + " " + car1;
        const carfull2 = arabalar.marka + " " + car2;

        res.redirect(`/car_compare/result?carname1=${carfull1}&carname2=${carfull2}`);
    } catch (error) {
        next(error); // Hata middleware'ine gönder
    }
});

route.get('/car_compare/result', async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error); // Hata middleware'ine gönder
    }
});

// Hata Yönetimi Middleware'i (Sonda Olmalı)
route.use(errorHandler);

module.exports = route;
