const express = require("express");
const app = express();
const path = require('path');
const handleCompareRequest = require('./user/handle_compare_request');
const sequelize = require('./configg'); // Doğru dosya yolu kullanılıyor
const TechnicalSpecification = require('./model/teknik_özellikler'); // Model dosyasını kontrol edin

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

(async () => {
  try {
    // Veritabanı ile senkronizasyon
    await sequelize.sync({ force: true }); // Geliştirme için tabloyu yeniden oluşturur
    console.log('TechnicalSpecification table has been created successfully.');

    // Örnek bir kayıt ekleme
    const newRecord = await TechnicalSpecification.create({
      year: 2022,
      price: 50000.00,
      horsepower: 300,
      weight: 1500,
      top_speed: 220.50,
      drivetrain: 'AWD',
      braking: 8.5,
      acceleration: 6.7,
      handling: 9.0,
      performance_index: 750,
      zero_to_sixty: 3.45,
      zero_to_hundred: 9.00,
      weight_distribution: '50:50',
      plb_ratio: 3.750,
      release_date: new Date('2022-03-01'),
      group_type: 'Sports'
    });

    console.log('New record added:', newRecord.toJSON());
  } catch (error) {
    console.error('Error syncing or inserting data:', error);
  } finally {
    await sequelize.close();
  }
})();

app.use('/compare-cars', handleCompareRequest);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
