const express = require("express");
const app = express();
const path = require('path');
const usersRouters = require('./routes/usersRoutes');
const adminRouters = require('./routes/AdminRoutes');
const session = require('express-session');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));
app.use(express.static('node_modules'));

app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'public/views/ejs'), // Kullanıcı için
  path.join(__dirname, 'private/views/ejs') // Admin için
]);


app.use(
  session({
    secret: 'gizliAnahtar',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false ,
      maxAge: 24 * 60 * 60 * 1000 
    }
  })
);

app.use('/admin', adminRouters);
app.use('/', usersRouters);


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
