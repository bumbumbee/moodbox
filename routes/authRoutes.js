const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

// @route   /api/regsiter
// @access  Public
// @desc    Register new user
router.post('/api/register', async (req, res) => {
    console.log(req.body);
    const {email, firstname, lastname, password} = req.body;
    const errors={};
    if(!email) errors.email='email is required';
    if(!firstname) errors.firstname='firstname is required';
    if(!lastname) errors.lastname='last name is required';
    if(!password) errors.password='password is required';
    // tikrinam, ar errors nera tuscias
    if(!_.isEmpty(errors)) return res.status(400).json(errors);
    // patikrinam ar egzistuoja toks user
    const match = await User.findOne({email});
    if (match) {
        return res.status(400).json({email: 'user already registered'})
    }
    console.log(errors);
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        firstname,
        lastname,
        password: hash,
        followers: [],
        following: []
    });
    try {
        await user.save();
        res.json(user)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});

// @route   POST  /api/login
// @access  Public
// @desc    Login user
router.post('/api/login', async (req, res) => {
    // ieskom vartotojo is DB
    console.log(req.body);
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).json({message:'bad login credentials'});
    // patikrinam password
    console.log(user.password);
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log(match);
    if(!match) return res.status(400).json({message:'bad login credentials'});
    const userData = _.pick(user,['_id', 'firstname', 'lastname', 'createdAt','followers','following','email']);
    const token = jwt.sign(userData, process.env.JWT_KEY);
    res.send(token);
});


module.exports = router;