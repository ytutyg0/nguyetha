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
                    req.flash('error','Vui lòng nhập địa chỉ email của bạn. ');
                    return res.redirect('/resetpassword');
                }
                User.findOne({email: req.body.email}, function(err, user){
                    if(!user){
                        req.flash('error','Không tồn tại tài khoản với email này. ');
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
                    user: 'ytutygfp0@gmail.com',
                    pass: 'yoxpfrzkdkadidgs'
                    }
                });
                var mailOptions = {
                    from: 'ytutygfp0@gmail.com',
                    to: user.email,
                    subject: 'Liên kết kích hoạt tài khoản từ ORCHID COSMETIC',
                    text: 'Bạn nhận được thư này vì đã yêu cầu thay đổi mật khẩu cho ORCHID COSMETIC'
                    +'\n\n'+
                    'http://'+req.headers.host+'/resetpassword/'+token +'\n\n'+
                    'Nếu bạn không yêu cầu, vui lòng bỏ qua thư'
                };
                smtTransport.sendMail(mailOptions, function(err){
                    if(!err){
                        console.log('email sent');
                        res.render('emailSent');
                    }else{
                        req.flash('error','Không thể gửi email tới'+ user.email);
                        res.redirect('/resetpassword');
                    }
                })

            }
        ])
    }
    resetPassword(req, res, next){
        User.findOne({resetPasswordToken: req.params.token}, function(err, user){
            if(!user){
                req.flash('error','Không tồn tại tài khoản với email này. ');
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
                        req.flash('error', 'Yêu cầu thay đổi tài khoản không hợp lệ hoặc đã hết hạn. ');
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
                        req.flash('error', 'Mật khẩu không khớp!');
                        return res.redirect('/resetpassword/'+ req.params.token);
                    }
                })
            },
            function(user, done){
                var smtTransport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: 'ytutygfp0@gmail.com',
                    pass: 'yoxpfrzkdkadidgs'
                    }
                });
                var mailOptions = {
                    from: 'ytutygfp0@gmail.com',
                    to: user.email,
                    subject: 'Mật khẩu của bạn đã được thay đổi',
                    text: 'Xin chào,\n\n'+
                    'Đây là thư xác nhận mật khẩu cho tài khoản '+user.email+' của bạn đã được thay đổi thành công'
                };
                smtTransport.sendMail(mailOptions, function(err){
                    if(!err){
                        // return res.render('home',{csrfToken: req.csrfToken()});
                        return res.redirect('/');
                    }else{
                        req.flash('error','Không thể gửi email tới'+ user.email);
                        return res.render('resetpassword');
                    }
                })
            }
        ])
    }
}
module.exports = new passwordController;