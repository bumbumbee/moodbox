const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');


mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true});
mongoose.connection
    .once('open', () => console.log('connected to db'))
    .on('error', () => console.log(err));
mongoose.Promise = global.Promise;

// globalus kintamieji pasiekiami process.env
//console.log(process.env);

// server configuration
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// static files
app.use(express.static(__dirname + '/public'));


// use routes
app.use('/', authRoutes);
app.use('/', postRoutes);
app.use('/', userRoutes);
// production versija
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/client/build'));
    app.get('/*', (req, res) => {
        res.sendFile(__dirname + '/client/build/index.html')
    })
}


app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});