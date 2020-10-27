const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: '3306' 
});

const publicDirectory = path.join(__dirname,'./public_style');
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (as sent bt HTML forms)
//Make sure that can grab data from any form
app.use(express.urlencoded({ extended: false}));
//Parse JSON bodies (as sent by API clients)
//Make sure values that come in are JSON 
app.use(express.json());
//Set up cookie in the browser
app.use(cookieParser());


app.set('view engine', 'hbs'); //Find folder 'views' by hbs default

db.connect( (err) => {
    if(err){
        throw err;
    }else{
        console.log("MySQL Connected...");
    }
});

//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log("Server started on port " + port);
})