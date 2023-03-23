const Product = require("../models/productSchema");
const { mutipleMongooseToObj } = require('../utils/mongoose');

class SiteController {

    // [GET] /
    home(req, res, next) {
        Product.find({})
            .then(products => {
                products = mutipleMongooseToObj(products);

                //sale item
                const saleItems = {}
                for(let i = 1; i< products.length; i++){
                    saleItems[i] = products[i];
                }
                const product = products[0];

                //new arrivals
                const newArrivals = products.filter(product => {
                    if(product.tag){
                        if(product.tag[0] ==='NewArrivals'){
                            return product;
                        }
                    }
                });

                //best sellers
                const bestSellers = products.filter(product => {
                    if(product.tag){
                        if(product.tag[0] ==='BestSellers' || product.tag[1] ==='BestSellers'){
                            return product;
                        }
                    }
                });

                res.render('home', { newArrivals, saleItems, product, bestSellers})
            })
            .catch(next);
    }
    //[GET] /emailSent
    emailSent(req, res, next){
        res.render('emailSent');
}
}


module.exports = new SiteController;