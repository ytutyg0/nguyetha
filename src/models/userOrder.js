const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOrder = new Schema({
    user : {type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    phone: String,
    cart: Object,
    address: Object,
    payment: Object,
    dateOrder: String,
    status:String
});
module.exports = mongoose.model('UserOrder', UserOrder);