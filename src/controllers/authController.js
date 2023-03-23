const passport = require('passport');

class AuthController {
    //[GET] /fb
    // fb(req, res, next){
    //     // const messages = req.flash('error');
    //     res.render('resetpassword');
    // }
    //  /fb
    fb = passport.authenticate('facebook',{scope: ['email']});
    fb_cb = passport.authenticate('facebook',{
        failureRedirect: '/login',
        successRedirect: '/'
    });
}
module.exports = new AuthController;