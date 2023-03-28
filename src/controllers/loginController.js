const passport = require('passport');

class LoginController {
    // [GET] /login
    login(req, res, next){
        let messages = req.flash('error');
        if (messages[0] === "Missing credentials") messages[0] = "Thiếu thông tin đăng nhập"
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