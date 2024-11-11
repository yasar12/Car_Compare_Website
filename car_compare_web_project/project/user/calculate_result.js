const express = require("express");
const app=express();
const path = require('path');
const db = require('../data/db');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'))
app.use(express.static('node_modules'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


async function Compare_cars(selected_cars) {
    try {
        // Dinamik yer tutucular oluştur
        const placeholders = selected_cars.map((_, index) => `$${index + 1}`).join(', ');
        
        const queryText = `SELECT * FROM technicalSpecifications WHERE name IN (${placeholders})`;
        const result = await db.query(queryText, selected_cars); // Her öğe için ayrı parametre
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
module.exports = Compare_cars();