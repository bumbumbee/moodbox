const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const userAuth = require('../auth/authUser');
const multer = require('multer');
const fs = require('fs');
//const upload = multer({ dest: 'public/uploads/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        req.body.filename = filename;
        cb(null, filename)
    }
});
const upload = multer({storage: storage});


// @route   POST  /api/posts
// @access  Current User
// @desc    Create new post
router.post('/api/posts', userAuth, upload.single('postimage'), async (req, res) => {
    console.log(req.body.filename);
    const {title, content, filename} = req.body;
    try {
        const post = new Post({
            title,
            content,
            img: filename,
            likes: [],
            user: req.user._id
        });
        await post.save();
        res.json(post)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});

// @route   GET   /api/posts
// @access  All users
// @desc    get all posts
router.get('/api/posts', userAuth, async (req, res) => {
    const posts = await Post.find()
        .populate({path: 'user', select: ['firstname', 'lastname', '_id']});
    res.json(posts)
});

// @route DELETE /api/posts/:id
// @access Current user
// @desc Delete post
router.delete('/api/posts/:id', userAuth, async (req, res) => {
    console.log(req.user);
    try {
        // surandam posta pagal pateikta id
        const post = await Post.findById(req.params.id);
        // tikrinam,ar post user sutampa su user id
        if (req.user._id != post.user) return res.status(403).json({message: 'deleting other post?'});
        // trinam paveiksleli is uploads + trinam posta
        fs.unlink(__dirname + '/..' + '/public/uploads/' + post.img, async (err) => {
            if (post.img && err) {
                console.log(err);
                return res.status(404).json({message: 'image not found'})
            }
            await post.remove();
            res.json(post);
        });

    } catch (err) {
        res.status(400).json({message: 'incorrect data'})
    }
});

// @route GET /api/post/:title
// @access Public
// @desc Get one post
router.get('/api/post/:title', userAuth, async (req, res) => {
    console.log(req.params);
    try {
        // verciam title bruksnius i tarpus
        const title = req.params.title.replace(/-/g, ' ');
        console.log(title);
        const post = await Post.findOne({title})
            .populate({path: 'user', select: ['firstname', 'lastname', '_id']});

        if (!post) return res.status(404).json({message: 'post not found'});
        res.json(post)
    } catch (err) {
        res.status(404).json({message: 'post not found'})
    }
});

// @route   POST  /api/posts/:id
// @access User
// @desc    Like post
router.post('/api/posts/:id', userAuth, async (req, res) => {
    // vartotojas, kuri laikina posta   req.user
    const post = await Post.findById(req.params.id);
    // tikrinam, ar User jau yra palaikines posta
    const liked = post.likes.includes(req.user_id);
    console.log(liked);
    if (liked) {
        post.likes = post.likes.filter(like => {
            return like !== req.user._id
        })
    } else {
        post.likes = [...post.likes, req.user._id];
    }
    await post.save();
    res.json(post)

});


// @route   POST  /api/post-comment/:id
// @access  User
// @desc    Comment post
router.post('/api/post-comment/:id', userAuth, async (req, res) => {
    // surasti post pagal id
    const post = await Post.findById(req.params.id);
    if(!post) res.status(404).json({message: 'post not found'});
    // irasyti komentara i surasta post
    const {firstname, lastname, _id}=req.user;
    const comments = post.comments;
    const comment = {
        user:{firstname,lastname,_id},
        comment: req.body.comment};
    comments.unshift(comment);
    // issaugoti post
    post.comments = comments;
    await post.save();
    res.json(post)
});


module.exports = router;