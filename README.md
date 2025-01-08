# Car_Compare_Website

Proje içerisinde 3 katmanlı mimari kullandık. Sunum katmanı kullanıcı arayüzümüz, iş mantığı katmanımız route sınıfları ve veri katmanımız ise repository classlarının postgreSQL ile birleştirilmesiyle sağlandı.

Projede toplamda 4 temel ve 3 diğer design pattern kullanıldı. Bunlar; Singleton, Observer, Proxy, Strategy, Route, Repository, Configuration design patternlarıdır.

Config dosyamızın içerisinde database adında bir class mevcut database bu class içerisinde bir kez tanımlanıyor daha sonra tüm projede bu database kullanılıyor. Bir kez tanımlandığından burada Singleton design pattern mevcut.
Aynı şekilde database içerisindeki değişimlerin vs bu class üzerinde yapılabilmeside configuration design patternı destekliyor.

userRoute ve adminRoute classları sayesinde route design pattern kullanıldı.
userRepository ve adminRepository ile ise reposityory design pattern kullanıldı.

Proxy dosyası içinde RouteProx classı sayesinde proxy design pattern kullanıldı.
Logger dosyasının içinde ise UserLoggin classı içinde observer design pattern kullanıldı. Bu classta karşılaştırma işlemleri ve ziyaret sayısı logglanıyor.

Strategy design patternımız ise data içerisindeki py dosyamızda kullanılmaktadır. Bu py dosyasında ilgili siteden veri kazımayla veriyi aldığımız ve ilgili bilgileri database e kaydetme işlemlerini yaptığımız kod bulunmakta.



