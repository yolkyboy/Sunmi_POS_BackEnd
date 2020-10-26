const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");

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

app.set('view engine', 'hbs'); //will find folder 'views' by hbs default

db.connect( (err) => {
    if(err){
        throw err;
    }else{
        console.log("MySQL Connected...");
    }
});

app.get("/", (req,res) =>{
    res.render("index")
});

app.get("/register", (req,res) =>{
    res.render("register")
});

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log("Server started on port " + port);
})