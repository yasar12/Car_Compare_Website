import requests
from bs4 import BeautifulSoup
import psycopg2

# Veritabanı bağlantısı
conn = psycopg2.connect(
    dbname="carComDb",
    user="postgres",       # Kullanıcı adınız
    password="1110",   # Şifreniz
    host="localhost",      # Sunucu adresi, localhost kullanıyorsanız
    port="5432"            # PostgreSQL'in varsayılan portu
)
cursor = conn.cursor()

# "N/A" değerlerini None (NULL) ile değiştiren fonksiyon
def clean_value(value):
    if value in ["N/A", "X"]:
        return None
    if isinstance(value, str):
        value = value.replace(',', '')
        value = value.replace('..', '.')
        # Tarih formatı kontrolü (YYYYMMDD)
        if len(value) == 8 and value.isdigit():
            return f"{value[:4]}-{value[4:6]}-{value[6:]}"
        # Diğer sayısal değerler için mevcut kontroller
        try:
            if '.' in value:
                return float(value)
            elif value.isdigit():
                return int(value)
        except ValueError:
            pass
    return value

# Web sitesinin URL'si
url = "http://myforzagarage.com"  # HTTPS yerine HTTP'yi deneyin
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    car_rows = soup.find_all('tr', class_='aCar')

    for car in car_rows:
        # Verileri Çekme
        car_year = car.find('td', class_='myYear').text
        car_manu = car.find('td', class_='myManu').text
        car_model = car.find('td', class_='myModel').text
        car_price = car.find('td', class_='myCredits').text
        car_hp = car.find('td', class_='myHp').text
        car_weight = car.find('td', class_='myWeight').text
        car_top_speed = car.find('td', class_='myTop').text
        car_drive = car.find('td', class_='myDrive').text
        car_brake = car.find('td', class_='myBrake').text
        car_accel = car.find('td', class_='myAccel').text
        car_handling = car.find('td', class_='myHand').text
        car_pi = car.find('td', class_='myPi').text
        car_060 = car.find('td', class_='my060').text
        car_0100 = car.find('td', class_='my0100').text
        car_dist = car.find('td', class_='myDist').text
        car_plb = car.find('td', class_='myPLB').text
        car_debut = car.find('td', class_='myDebut').text
        car_group = car.find('td', class_='myGroup').text

        # "N/A" kontrolü
        if "N/A" in [car_year, car_manu, car_model, car_price, car_hp, car_weight, 
                     car_top_speed, car_drive, car_brake, car_accel, car_handling, 
                     car_pi, car_060, car_0100, car_dist, car_plb, car_debut, car_group]:
            continue  # Bu arabayı atla ve döngünün başına dön

        # Değerleri temizle
        car_year = clean_value(car_year)
        car_price = clean_value(car_price)
        car_hp = clean_value(car_hp)
        car_weight = clean_value(car_weight)
        car_top_speed = clean_value(car_top_speed)
        car_drive = clean_value(car_drive)
        car_brake = clean_value(car_brake)
        car_accel = clean_value(car_accel)
        car_handling = clean_value(car_handling)
        car_pi = clean_value(car_pi)
        car_060 = clean_value(car_060)
        car_0100 = clean_value(car_0100)
        car_dist = clean_value(car_dist)
        car_plb = clean_value(car_plb)
        car_debut = clean_value(car_debut)
        car_group = clean_value(car_group)

        # car tablosuna ekleme
        cursor.execute("""
            INSERT INTO car (trademark, model) VALUES (%s, %s) RETURNING carid;
        """, (car_manu, car_model))
        carid = cursor.fetchone()[0]

        # technicalSpecification tablosuna ekleme
        cursor.execute("""
            INSERT INTO technicalSpecification (
                carid, year, price, horsepower, weight, top_speed, drivetrain,
                braking, acceleration, handling, performance_index, zero_to_sixty,
                zero_to_hundred, weight_distribution, plb_ratio, release_date, group_type
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            carid, car_year, car_price, car_hp, car_weight, car_top_speed, car_drive,
            car_brake, car_accel, car_handling, car_pi, car_060, car_0100, car_dist,
            car_plb, car_debut, car_group
        ))

    # İşlemleri kaydet ve bağlantıyı kapat
    conn.commit()
    cursor.close()
    conn.close()
    print("Veri ekleme işlemi tamamlandı.")

else:
    print(f"Sayfa alınırken hata oluştu: {response.status_code}")
