const express = require("express");
const route = express.Router();
const path = require('path');
const userrepository = require("../repositories/userRepository");



route.get("/car_compare", (req, res) => {
    res.render("index");
});

route.post('/compare', (req, res) => {
    const { leftBrand, leftModel, rightBrand, rightModel } = req.body;

    const carData = userrepository.MarkaVeModel_Getir();
    console.log(carData);
    const brandLeft = req.query.brandLeft || '';
    const brandRight = req.query.brandRight || '';
    const modelsLeft = carData[brandLeft] || [];
    const modelsRight = carData[brandRight] || [];
    
    res.render('index', { brandLeft, modelsLeft, brandRight, modelsRight });

    res.redirect('/result');
});


route.get('/result', (req, res) => {
    res.render('result');
});


module.exports = route;





