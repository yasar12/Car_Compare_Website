const express = require("express");
const app = express();
const path = require('path');
const usersRouters = require('./routes/usersRoutes');
const adminRouters = require('./routes/AdminRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views/ejs'));



app.use(usersRouters);


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
