const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');
const FbStrategy = require('passport-facebook').Strategy;
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');


//tell passport how to store User in session
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

//id is the user.id 
passport.deserializeUser((req,id, done) => {
    User.findById(id, (err, user)=>{
        done(err, user);
    })
});

//create user
// sign up strategy name for localStrategy when creat user local.signup 
passport.use('local.signup', new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true}, 
    (req, email, password, done) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let messages = [];
        errors.errors.forEach(err =>  messages.push(err.msg));
        return done(null, false, req.flash('error', messages));
    } else {
        User.findOne({email:email}, (err, user) =>{
            if(err){
                return done(err)
            }
            if(user){
                return done(null, false, {message: 'Email is already in use !'})
            }
            const newUser = new User();
            newUser.name = req.body.name;
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save((err, resut) =>{
                if(err){
                    return done(err);
                }
                return done(null, newUser)
            });
        })
    }
}));

passport.use('local.login', new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true}, 
    (req, email, password, done) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let messages = [];
        errors.errors.forEach(err =>  messages.push(err.msg));
        return done(null, false, req.flash('error', messages));
    } else {
        User.findOne({email:email}, (err, user) =>{
            if(err){
                return done(err);
            }
            if(!user){
                
                return done(null, false, {message: 'User not found '})
            }
            if(!bcrypt.compareSync(password, user.password)){
                return done(null, false, {message: 'Wrong password '})
            }
            return done(null, user)
        })
    }
}))
passport.use(new FbStrategy(
    {
    clientID: '1653437488162524',
    clientSecret: '499b3e00b68c19476fb8ad15e72f948c',
    callbackURL:'http://localhost:5000/auth/fb/cb',
    profileFields: ['email'],
    passReqToCallback : true}, 
    (req,accessToken, refreshToken, profile, done) => {
        User.findOne({email: profile._json.email}, (err, user) =>{
            if(err){
                return done(err);
            }
            if(user){
                return done(null, user);
            }
            const newUser = new User();
            newUser.email = profile._json.email;
            newUser.save((err, resut) =>{
                if(err){
                    return done(err);
                }
                return done(null, newUser)
            });
            
        })
}))