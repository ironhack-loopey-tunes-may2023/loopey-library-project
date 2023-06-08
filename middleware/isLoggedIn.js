
function isLoggedIn(req, res, next){
    if(req.session.currentUser){
        // user is logged in
        next();
    } else {
        // user not logged in
        res.redirect("/login");
    }
}


module.exports = isLoggedIn;