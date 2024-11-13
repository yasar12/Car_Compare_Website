const express = require("express");
const app = express();
const path = require('path');
const sequelize = require('./deneme'); 
const TechnicalSpecification = require('./model/teknik_özellikler'); 


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'./public/views'));



app.get('/car_compare', (req, res) => { 
  
  res.render('./public/views/ejs/index');
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
