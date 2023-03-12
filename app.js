const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const Post = require('./models/Post')



const app = express();
app.use(fileUpload());

mongoose.connect('mongodb://localhost/pcat-test-db');

/***PUBLİC İÇERİSİNDE STATİK DOSYALAR VAR DİYOR***/
app.use(express.static('public'));
/*******/


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
    /*** TEMPLATE ENGİNE'I EJS OLARAK AYARLADIK ***/
app.set("view engine", "ejs");
/*******/
app.get("/", async(req, res, ) => {
    const posts = await Post.find({});
    res.render('index', {
        posts
    });
});

app.get("/post/:postid", async(req, res, ) => {
    const post = await Post.findById(req.params.postid);
    res.render('post', {
        post
    })
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
//uploads klasörü yoksa oluştur
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.post('/posts', async(req, res) => {

    let uploadedImage = req.files.postImage;
    let uploadPath = __dirname + "/public/uploads/" + uploadedImage.name;



    uploadedImage.mv(uploadPath, async() => {
        await Post.create({
            ...req.body,
            postImage: '/uploads/' + uploadedImage.name,

        })

    });

    res.redirect('/')
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server ${port} portunda dinleniyor`);
});