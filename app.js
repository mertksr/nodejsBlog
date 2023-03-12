const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override')
const Post = require('./models/Post')
const postController = require('./controller/postController')
const pageController = require('./controller/pageController')

/* MIDDLEWARES */
const app = express();
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
    /***PUBLİC İÇERİSİNDE STATİK DOSYALAR VAR DİYOR***/
app.use(express.static('public'));
/**************/

mongoose.connect('mongodb://localhost/pcat-test-db');



/*** TEMPLATE ENGİNE'I EJS OLARAK AYARLADIK ***/
app.set("view engine", "ejs");
/*******/

app.get("/", postController.getAllPosts);
app.get("/post/:id", postController.getPost);
app.put("/post/:id", postController.updatePost);
app.post('/post', postController.createPost);
app.delete("/post/:id", postController.deletePost);

app.get("/about", pageController.getAboutPage);
app.get("/add-post", pageController.getAddPostPage);
app.get("/post/edit/:id", pageController.getEditPage);


/************ PHOTO UPLOAD **********/
//uploads klasörü yoksa oluştur
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
/****/
/******************************/

const port = 3000;
app.listen(port, () => {
    console.log(`Server ${port} portunda dinleniyor`);
});