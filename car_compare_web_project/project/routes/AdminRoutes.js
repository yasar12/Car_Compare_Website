const express = require("express");
const route = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const adminRepository = require("../repositories/adminRepository");
const axios = require('axios');
const { exec } = require('child_process');
function errorHandler(err, req, res, next) {
    console.error('Error Middleware:', err.stack);
    res.status(err.status || 500).send({ error: err.message || 'Internal Server Error' });
}

//Sesssion kontrolü için method
function sessionValidation(req, res, next) {
    if (req.session && req.session.loggedIn) {
      return next(); // Giriş yapılmışsa bir sonraki middleware'e geç
    }
    res.status(403).json({ error: 'Forbidden: Unauthorized access' });
  }
  
route.use(express.json()); 
route.use(express.urlencoded({ extended: true })); 
route.use(cookieParser());

// Admin kullanıcı bilgileri
const adminCredentials = {
    username: 'admin',
    password: '12345'
  };

route.post('/api/run-script',async (req, res) => {
    console.log("oldu");
    exec('python.exe C://Users//hayla//Documents//GitHub//Car_Compare_Website//car_compare_web_project//project//routes//sportdatatable.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Script çalıştırılırken hata oluştu: ${error.message}`);
            return res.status(500).json({ success: false, message: error.message });
        }
        if (stderr) {
            console.error(`Hata: ${stderr}`);
            return res.status(500).json({ success: false, message: stderr });
        }
        console.log(`Script Çıktısı: ${stdout}`);
        res.json({ success: true, message: 'Script başarıyla çalıştırıldı.' });
    });
});

//Admin panel giriş yapma ekranı
  route.get('/login', (req, res) => {
    
   if(req.session.loggedIn){
     res.redirect('/admin');
   }
   else{
    res.render('admin-login'); // Admin paneline yönlendir
   }
      
    
    
  });


  //Admin ekranı için doğrulama
  route.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username === adminCredentials.username && password === adminCredentials.password) {
      req.session.loggedIn = true; // Kullanıcıyı oturum açmış olarak işaretle
      res.redirect('/admin'); // Admin paneline yönlendir
    } else {
      res.send('<h1>Giriş Başarısız! Yanlış kullanıcı adı veya şifre.</h1><a href="/admin/login">Tekrar Dene</a>');
    }
  });


  
  // Middleware uygulama
  route.use(sessionValidation);

  // Admin Ana sayfa
route.get('/', (req, res,next) => {
  try{
res.render('Admin');
  }
  catch(error){
    next(error); 
  }
    
});

//Site üzerinde yapılan toplam karşılaştırma sayısı
route.get('/api/total-comparisons', async (req, res,next) => {
    try {
        const totalComparisons = await adminRepository.Toplam_Karsilastirma_Miktari(); // await eklenmeli!
        

        // JSON formatında düzgün döndür
        res.json({ totalComparisons: totalComparisons || 0 });
    } catch (error) {
        next(error); 
    }
});


//belirli zaman aralığındaki karşılaştırmayı çeker
route.get('/api/total-comparisons-data', async (req, res,next) => {
    console.log("istek geldi");
    const { startDate, endDate, mode } = req.query;
    console.log(req.query);
    // Parametrelerin doğruluğunu kontrol et
    if (!startDate || !endDate || !mode) {
        return res.status(400).json({ error: 'Lütfen tüm parametreleri sağlayın.' });
    }

    try {
        let data;

        if (mode === 'yearly') {
            // Yıllık veriyi çek
            data = await adminRepository.aralikli_İstatistik_Getir(startDate, endDate, 'yearly');
        } else if (mode === 'monthly') {
            // Aylık veriyi çek
            data = await adminRepository.aralikli_İstatistik_Getir(startDate, endDate, 'monthly');
        } else {
            return res.status(400).json({ error: "Geçersiz mod. 'yıllık' veya 'aylık' seçmelisiniz." });
        }

        // İstatistik verisini döndür
        return res.json(data);
    } catch (error) {
        console.error('GET isteği sırasında hata:', error);
        return res.status(500).json({ error: 'Veri alınamadı.' });
    }
});

//en çok karşılaştırılan arabaları çeker
route.get('/api/comparison-data', async (req, res, next) => {
    try {
        const comparisonData = await adminRepository.İstatistik_Getir(); 

        // Eğer veri bulunamadıysa uygun bir HTTP durumu ve mesaj döndür
        if (!comparisonData || comparisonData.length === 0) {
            console.warn("Comparison data bulunamadı.");
            return res.status(404).json({ message: "Comparison data bulunamadı." });
        }

        // Veri bulunduğunda JSON olarak döndür
        res.status(200).json(comparisonData);

    } catch (error) {
        console.error("Comparison data alınırken hata oluştu:", error);
        
        // Hata durumunda uygun bir mesaj ile hata döndür
        res.status(500).json({ 
            message: "Comparison data alınırken bir hata oluştu.", 
            error: error.message 
        });

        // Eğer middleware üzerinden hata yönetimi yapıyorsanız next ile hatayı iletin
        next(error);
    }
});


//ziyaretçi bilgilerini çeker
route.get('/api/visitor-count', async (req, res) => {
    try {
        const { startDate, endDate, mode } = req.query;

        if (!startDate || !endDate || !mode) {
            return res.status(400).json({ error: 'Lütfen başlangıç, bitiş tarihlerini ve modu sağlayın.' });
        }

        const data = await adminRepository.ziyaretci_İstatistik_Getirr(startDate, endDate, mode);
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error('Ziyaretçi verisi alınırken hata:', error);
        res.status(500).json({ error: 'Ziyaretçi verisi alınamadı.' });
    }
});







  route.use(errorHandler);

module.exports = route;

