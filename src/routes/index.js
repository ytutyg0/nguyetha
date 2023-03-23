const express = require('express');
const products = require('./products');
const admin = require('./admin');
const site = require('./site');
const search = require('./search');
const login = require('./login');
const logout = require('./logout');
const resetpassword = require('./resetpassword');
const signup = require('./signup');
const csrf = require('csurf');
const csrfProtection = csrf();
const auth = require('./auth');
const user = require('./user');

function route(app){
    app.use('/admin',isAdmin, admin);
    app.use('/products',products);
    app.use('/search',search);
    app.use('/user', isLogin, user)
    app.use('/auth', auth);
    app.use(csrfProtection);
    app.use('/login',notisLogin, login);
    app.use('/logout',logout)
    app.use('/signup', notisLogin,signup);
    app.use('/resetpassword', resetpassword);
    app.use('/', site);
}
function isLogin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/login');
    }
}
function notisLogin(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}
function isAdmin(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role){
            if(req.user.role === "ADMIN"){
                return next();
            }
        }else{
            return res.redirect('/');  
        }
    }else{
        return res.redirect('/');
    }
}

module.exports = route;