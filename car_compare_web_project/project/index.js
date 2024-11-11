const express = require("express");
const app=express();
const path = require('path');
const handleCompareRequest = require('./user/handle_compare_request');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'))
app.use(express.static('node_modules'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





app.use('/compare-cars', handleCompareRequest);





app.listen(3000,() =>{
    console.log("listening port 3000");
});