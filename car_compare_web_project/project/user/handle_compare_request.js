const express = require("express");
const path = require('path');
const calculate_result = require('./calculate_result');
const router = express.Router();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'))
app.use(express.static('node_modules'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



router.post('/compare-cars', async function (req, res) {
    const combo1 = req.body.combo1;
    const combo2 = req.body.combo2;
    const combo3 = req.body.combo3;
    const combo4 = req.body.combo4;

    // Arabaları karşılaştır
    
    const selectedCars = [
        { car1: { combo1, combo2 } },
        { car2: { combo3, combo4 } }
    ];

    try {
        const carData = await Compare_cars(selectedCars);
        // Hesaplama yap ve sonucu sayfaya gönder
        

    res.render('/result', { carData });
        } catch (error) {
            console.error('Error handling compare request:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    module.exports = router;