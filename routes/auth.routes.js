const express = require('express');
const bcryptjs = require("bcryptjs");

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
            res.redirect("/user-profile");
        })
        .catch(error => {
            console.log("error creating account...", error);
            next(error)
        });
});


//GET user-profile
router.get('/user-profile', (req, res) => res.send('this is your user profile'));


module.exports = router;