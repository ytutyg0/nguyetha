const Product = require("../models/productSchema");
const { mutipleMongooseToObj } = require('../utils/mongoose');
const { mongooseToObj } = require('../utils/mongoose');
const Cart = require('../models/cart');
const { compare } = require("bcrypt-nodejs");
const { log } = require("async");

class ProductController{

    // [GET] /products/:id
    index(req, res, next){
        Product.findOne({_id : req.params.id})
            .then(product => {
                res.render('products', {product : mongooseToObj(product)})
            })
            .catch(next);
    }
    search(req, res, next){
        let str = req.query.search;
        const regex = new RegExp(escape(str), 'gi');
        Product.find({title : regex})
            .then(products => {
                res.render('showproducts', {title : req.params.type ,products : mutipleMongooseToObj(products)})
            })
            .catch(next);
    }
    // [GET] /type/:type
    showType(req, res, next){
        let str = req.params.type;
        str = str.replace("-", " ");
        Product.find({type : str})
            .then(products => {
                res.render('showproducts', {title : req.params.type ,products : mutipleMongooseToObj(products)})
            })
            .catch(next);
    }
    showTag(req, res, next){
        Product.find({ tag : req.params.tag})
            .then(products => {
                res.render('showproducts', {title : req.params.type ,products : mutipleMongooseToObj(products)})
            })
            .catch(next);
    }
    // [GET] /brand/:brand
    showBrand(req, res, next){
        let str = req.params.brand;
        str = str.replace("-", " ");
        Product.find({ brand : str})
            .then(products => {
                res.render('showproducts', {title : req.params.brand ,products : mutipleMongooseToObj(products)})
            })
            .catch(next);
    }
    showAll(req, res, next){
        Product.find({})
            .then(products => {
                res.render('showproducts', {title : req.params.brand ,products : mutipleMongooseToObj(products)})
            })
            .catch(next);
    }
    addCart(req, res, next){
        const productID = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productID, (err, product)=>{
            if(err){
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            return res.redirect('back');
        })

    }
    cartView(req, res, next){
        if(!req.session.cart){
            return res.render('shoppingCart', {products: null});
        }
        const cart = new Cart(req.session.cart);
        res.render('shoppingCart', {products: cart.generateArray(), 
                                    totalPrice: cart.totalPrice.toFixed(2)});
    }
    removeCart(req, res, next){
        const productID = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productID, (err, product)=>{
            if(err){
                return res.redirect('/products/shopping-cart');
            }
            const olcard = cart;
            cart.remove(product, product.id);
            req.session.cart = cart;
            return res.redirect('/products/shopping-cart');
        })
    }
}

module.exports = new ProductController;