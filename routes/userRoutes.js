const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const userAuth = require('../auth/authUser');

// @route   GET   /api/users
// @access  Test
// @desc    get all users from DB
router.get('/api/users', async (req, res)=>{
   const users = await User.find().select('-password');
   res.json(users);
});

// @route   GET   /api/users/:id
// @access  Current user
// @desc    get current user data
router.get('/api/users/:id', userAuth, async (req, res)=>{
    try{
        const user = User.findById(req.params.id);
        const posts = Post.find({user:req.params.id});
        // visos uzklausos vienu metu (2 siuo atveju)
        const data = await Promise.all([user, posts]);
        console.log(data);
        if(!data[0]) return res.status(404).send('user not found'); // data[0] yra user, data[1] posts
        res.json(data)
    } catch (err){
        if(err) res.status(404).send('user not found');

    }
});

// @route   DELETE   /api/users
// @access  Current user
// @desc    get current user data
router.delete('/api/users', userAuth, async (req, res)=>{
   try{
       // istrinam User
       await User.findByIdAndRemove(req.user._id);
       // istrinam visus jo sukurtus Posts
       await Post.deleteMany({user:req.user.id});
       res.json({message:`User ${req.user.email} deleted`})
   } catch (err){
       res.status(404).json({message:'user not found'});
   }
});

module.exports = router;