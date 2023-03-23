const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const { check, validationResult } = require('express-validator');

class passwordController {
    //[GET] /resetpassword
    getEmail(req, res, next){
        const messages = req.flash('error');
        res.render('resetPassword', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    }
    // [POST] /sendEmail
    sendEmail_POST(req, res, next){
        async.waterfall([
            function(done){
                crypto.randomBytes(20, function(err, buf){
                    const token = buf.toString('hex');
                    done(err, token)
                })
            },
            function(token, done){
                if(!req.body.email){
                    req.flash('error','Please enter an E-mail. ');
                    return res.redirect('/resetpassword');
                }
                User.findOne({email: req.body.email}, function(err, user){
                    if(!user){
                        req.flash('error','No account with that E-mail exists. ');
                        return res.redirect('/resetpassword');
                    }
                    user.resetPasswordToken = token;
                    user.save(function(err){
                        done(err,token,user);
                    })
                })
            },
            function(token, user,done){
                var smtTransport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: '1801040157@s.hanu.edu.vn',
                    pass: '1801040157'
                    }
                });
                var mailOptions = {
                    from: '1801040157@s.hanu.edu',
                    to: user.email,
                    subject: 'Account Activation Link from KIMI COSMETIC',
                    text: 'You are receiving this beacause you have requested the reset of the password for KIMI COSMETIC'
                    +'\n\n'+
                    'http://'+req.headers.host+'/resetpassword/'+token +'\n\n'+
                    'If you did not request this, please ignore this email'
                };
                smtTransport.sendMail(mailOptions, function(err){
                    if(!err){
                        console.log('email sent');
                        res.render('emailSent');
                    }else{
                        req.flash('error','Failed to send request to'+ user.email);
                        res.redirect('/resetpassword');
                    }
                })

            }
        ])
    }
    resetPassword(req, res, next){
        User.findOne({resetPasswordToken: req.params.token}, function(err, user){
            if(!user){
                req.flash('error','No account with that E-mail exists. ');
                return res.redirect('/resetpassword');
            }
            res.render('changePassword', {csrfToken: req.csrfToken(), token: req.params.token});
        })
    }
    resetPassword_POST(req, res, next){
        async.waterfall([
            function(done){
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    let messages = [];
                    errors.errors.forEach(err =>  messages.push(err.msg));
                    return done(null, false);
                }
                User.findOne({resetPasswordToken: req.params.token}, function(err, user){
                    if(!user){
                        req.flash('error', 'Password reset token is invalid or has expired. ');
                        return res.redirect('back');
                    }
                    if(req.body.password === req.body.passwordConfirm){
                        user.password = user.encryptPassword(req.body.password);
                        user.resetPasswordToken = undefined;
                        user.save((err, resut) =>{
                            if(err){
                                return done(err);
                            }
                            return done(null, user)
                        });
                    }else{
                        req.flash('error', 'Passwords do not match!');
                        return res.redirect('/resetpassword/'+ req.params.token);
                    }
                })
            },
            function(user, done){
                var smtTransport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: '1801040157@s.hanu.edu.vn',
                    pass: '1801040157'
                    }
                });
                var mailOptions = {
                    from: '1801040157@s.hanu.edu',
                    to: user.email,
                    subject: 'Your Password has been changed',
                    text: 'Hello,\n\n'+
                    'This is a confirmation that the password for your account '+user.email+'has just been changed sucessfully'
                };
                smtTransport.sendMail(mailOptions, function(err){
                    if(!err){
                        // return res.render('home',{csrfToken: req.csrfToken()});
                        return res.redirect('/');
                    }else{
                        req.flash('error','Failed to send request to'+ user.email);
                        return res.render('resetpassword');
                    }
                })
            }
        ])
    }
}
module.exports = new passwordController;