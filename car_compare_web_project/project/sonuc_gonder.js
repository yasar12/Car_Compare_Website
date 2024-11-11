const express = require("express");
const app=express();

app.set('view engine','ejs');


function secimleriGonder() {
    const telefon1 = document.getElementById("telefon1").value;
    const telefon2 = document.getElementById("telefon2").value;

    fetch('/telefon-secimi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telefon1_id: telefon1, telefon2_id: telefon2 })
    })
    .then(response => response.text())
    .then(data => {
        console.log("Sunucudan Gelen Yanıt:", data);
        alert(data); // Sunucudan gelen yanıtı kullanıcıya göster
    })
    .catch(error => console.error("Hata:", error));
}