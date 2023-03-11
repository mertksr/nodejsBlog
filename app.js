const express = require('express');
const app = express();
const ejs = require('ejs');
/***PUBLİC İÇERİSİNDE STATİK DOSYALAR VAR DİYOR***/
app.use(express.static('public'));
/*******/
/*** TEMPLATE ENGİNE'I EJS OLARAK AYARLADIK ***/
app.set("view engine", "ejs");
/*******/
app.get("/", (req, res, ) => {
    res.render('index')
});
app.get("/about", (req, res, ) => {
    res.render('about')
});
app.get("/add-post", (req, res, ) => {
    res.render('add-post')
});
app.get("/post", (req, res, ) => {
    res.render('post')
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server ${port} portunda dinleniyor`);
});