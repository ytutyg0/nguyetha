const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

const User = new Schema({
    email : String,
    password: String,
    role: String,
    name: String,
    address: String,
    city: String,
    country: String,
    postaCode:String,
    phone: String,
    postalCode:String,
    resetPasswordToken: String,
    
});
User.methods.encryptPassword = (password) => { 
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
module.exports = mongoose.model('User', User);