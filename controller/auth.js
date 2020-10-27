const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});

exports.login = async(req, res) => {
    try {
        const{email, password} = req.body;

        if(!email  || !password){
            return res.status(400).render('login', {
                message: 'Please enter an email and password'
            });
        }

        db.query('SELECT * FROM accounts WHERE email=?', [email], async(error, results) => {
            console.log(results);
            //check users are exist, compare password from database
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res,status(401).render('login', {
                    message: 'Email or Password is incorrect'
                });
            } else{
                const id = results[0].id;

                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The tolen is: " + token);

                const cookieOption = {
                    expires: new Date( //convert to millisecond
                    Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *60* 1000
                    ),
                    httpOnly: true
                }

                res.cookie('Sunmi Cookie', token, cookieOption);
                res.status(200).redirect("/homePage");
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body); //Grab all the data from the <form>

    //Full version
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    //Destructured version
    const {name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM accounts WHERE email=?', [email], async(error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'This email is already used...'
            })
        }
        if(!name || !email || !password || !passwordConfirm){
            return res.render('register', {
                message: 'Please fill all information...'
            })
        }
        else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match...'
            });
        }
        //wait til the password was encrypted for 8 times
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO accounts SET ?', {username: name, password: hashedPassword, email: email}, (error, results) => {
            if(error){
                console.log(error);
            } else{
                console.log(results);
                return res.render('register', {
                    message: 'Registration Completed...'
                });
            }
        })
    });
}