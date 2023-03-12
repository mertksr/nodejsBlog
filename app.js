const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override')
const Post = require('./models/Post')


/* MIDDLEWARES */
const app = express();
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));
/**************/

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

app.get("/post/:id", async(req, res, ) => {
    const post = await Post.findById(req.params.id);
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
app.get("/post/edit/:id", async(req, res, ) => {
    const post = await Post.findOne({ _id: req.params.id })
    res.render('edit', {
        post
    })
});
app.get("/post", (req, res, ) => {
    res.render('post')
});
app.put("/post/:id", async(req, res, ) => {
    const post = await Post.findOne({ _id: req.params.id });
    post.postName = req.body.postName;
    post.postDetail = req.body.postDetail;
    post.save();

    res.redirect(`/post/${req.params.id}`);
});

app.delete("/post/:id", async(req, res, ) => {
    const post = await Post.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/public' + post.postImage;
    fs.unlinkSync(deletedImage);
    await Post.findByIdAndRemove(req.params.id);

    res.redirect('/');
});

/************ PHOTO UPLOAD **********/
//uploads klasörü yoksa oluştur
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
/****/
app.post('/post', async(req, res) => {
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
/******************************/

const port = 3000;
app.listen(port, () => {
    console.log(`Server ${port} portunda dinleniyor`);
});