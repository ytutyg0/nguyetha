const passport = require('passport');

class SignupController {
    //[GET] /signup
    signup(req, res, next){
        const messages = req.flash('error');
        res.render('signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    }
    // [POST] /signup
    signup_POST = passport.authenticate('local.signup', {
        failureRedirect: '/signup',
        successRedirect: '/login',
        failureFlash: true
    })
}
module.exports = new SignupController;