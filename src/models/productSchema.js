const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Product =  new Schema({
    title : String,
    img: String,
    brand: String,
    price: Number,
    salePrice : Number,
    qty: Number,
    tag: Array,
    type: String,
    detail: Object,
    createdAt: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Product', Product);