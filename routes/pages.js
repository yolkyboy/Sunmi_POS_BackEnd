const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    res.render('login');
});

router.get('/register', (req,res) => {
    res.render('register');
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/homePage', (req,res) => {
    res.render('homePage');
});

module.exports = router;