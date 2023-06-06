const express = require('express');
const router = express.Router();

const Author = require('../models/Author.model');


// READ: display all authors
router.get("/authors", (req, res, next) => {
    Author.find()
        .then(authors => {
            res.render("authors/authors-list", { authors });
        })
        .catch(e => {
            console.log("error getting list of authors from DB", e);
            next(e);
        });
});


module.exports = router;