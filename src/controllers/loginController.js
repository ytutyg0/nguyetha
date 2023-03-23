const passport = require('passport');

class LoginController {
    // [GET] /login
    login(req, res, next){
        const messages = req.flash('error');
        res.render('login', {csrfToken : req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    }
    // [GET] /logout
    logout(req, res, next){
        req.logout();
        res.redirect('/login');
    }
    //[POST] /login
    login_POST = passport.authenticate('local.login', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true,
        session: true
    })
}
module.exports = new LoginController;