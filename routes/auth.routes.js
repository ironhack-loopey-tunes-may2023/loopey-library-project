const express = require('express');
const bcryptjs = require("bcryptjs");
const mongoose = require('mongoose');

const User = require('../models/User.model');

const router = express.Router();

const saltRounds = 10;


//GET /signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});



//POST /signup
router.post("/signup", (req, res, next) => {

    const {email, password} = req.body;


    // make sure users fill all mandatory fields:
    if (!email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your email and password.' });
        return; // finish execution of the current function
    }


    // make sure passwords are strong:
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.status(400).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }


    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt);
        })
        .then( (hash) => {

            const newUser = {
                email: email,
                passwordHash: hash
            }
            
            return User.create(newUser);
        })
        .then( userFromDB => {
            res.redirect("/user-profile"); // user has been created, redirect to user profile
        })
        .catch(error => {
            console.log("error creating account...", error);

            if (error instanceof mongoose.Error.ValidationError) {
                console.log("this is a mongoose validator error")
                res.status(400).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(400).render('auth/signup', { errorMessage: 'Email needs to be unique.' });
            } else {
                console.log("this is NOT a mongoose validator error")
                next(error)
            }

        });
});


//GET /login
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});



//POST /login
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return;
    }

    User.findOne({email: email})
        .then( user => {
            if (!user) {
                //user doesn't exist (mongoose returns "null")
                res.status(400).render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)){
                //login successful
                req.session.currentUser = user; // store info in req.session (will be available in further requests)
                res.render("auth/user-profile", {userDetails: user});
            } else {
                //login failed
                res.status(400).render('auth/login', { errorMessage: 'Incorrect credentials.' });
            }
        })
        .catch(error => {
            console.log("error trying to login...", error);
            next(error);
        });

});


//POST /logout
router.post("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/'); // if logout sucessful, redirect to homepage
    });
})


//GET user-profile
router.get('/user-profile', (req, res) => {
    res.render("auth/user-profile", {userDetails: req.session.currentUser});
});


module.exports = router;