const fs = require('fs');
const Post = require('../models/Post')
exports.getAllPosts = async(req, res, ) => {
    const posts = await Post.find({}).sort('-dateCreated');
    res.render('index', {
        posts
    });
}

exports.getPost = async(req, res, ) => {
    const post = await Post.findById(req.params.id);
    res.render('post', {
        post
    })
}
exports.updatePost = async(req, res, ) => {
    const post = await Post.findOne({ _id: req.params.id });
    post.postName = req.body.postName;
    post.postDetail = req.body.postDetail;
    post.save();

    res.redirect(`/post/${req.params.id}`);
}

exports.deletePost = async(req, res, ) => {
    const post = await Post.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + post.postImage;
    fs.unlinkSync(deletedImage);
    await Post.findByIdAndRemove(req.params.id);

    res.redirect('/');
}

exports.createPost = async(req, res) => {
    let uploadedImage = req.files.postImage;
    let uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;
    uploadedImage.mv(uploadPath, async() => {
        await Post.create({
            ...req.body,
            postImage: '/uploads/' + uploadedImage.name,

        })

    });

    res.redirect('/')
}