const Product = require("../models/productSchema");
const UserOrder = require("../models/userOrder");
const Cart = require("../models/cart");
const { mutipleMongooseToObj } = require('../utils/mongoose');
const { mongooseToObj } = require('../utils/mongoose');

class AdminController{
    // [GET] /admin/create
    create(req, res, next){
        res.render('CRUDproduct/create');
    }
    // [POST] /admin/store
    store(req, res, next){
        let main_detail = {};
        main_detail.description = req.body.main_detail_description;
        main_detail.sub_description = req.body.sub_description;
        main_detail.feature = req.body.main_detail_feature.split(",");

        let sub_detail = {};
        sub_detail.feature = req.body.sub_detail_feature;
        const sub_detail_2 = req.body.sub_detail_2;
        const detail = {main_detail, sub_detail, sub_detail_2};
        
        const tag = req.body.tag.split(",");
        
        let product = {
            title : req.body.title,
            img: req.body.img,
            brand: req.body.brand,
            price: req.body.price,
            salePrice : req.body.salePrice,
            qty: parseInt(req.body.qty),
            tag: tag,
            detail: detail,
            type: req.body.type,
            createdAt: new Date(),
        };
        product = new Product(product);
        product.save();
        res.redirect('/admin/manage')
    }
    // [GET] /admin/manage
    manage(req, res, next){
        Product.find({})
            .then(products => res.render('CRUDproduct/manageProduct', 
                    {products : mutipleMongooseToObj(products)}))
            .catch(next);
    }
    // [GET] /admin/usermanagement
    manageUser(req, res, next){
        UserOrder.find({}, (err, orders)=>{
            if(err){
                res.redirect('/');
            }
            let cart;
            orders = mutipleMongooseToObj(orders);
            orders.forEach(order => {
                cart = new Cart(order.cart);
                order.item = cart.generateArray();
            })
            let continueStatus = "Waiting for confirm";
            res.render('CRUDproduct/userManagement', {orders, continueStatus});
        }) 
    }
    // [GET] /admin/update/:id
    update(req, res, next){
        Product.findOne({_id : req.params.id})
            .then(product => {
                const feature = product.detail.main_detail.feature;
                res.render('CRUDproduct/update', {product : mongooseToObj(product),feature})
            })
            .catch(next);
    }
    // [PUT] /admin/:id
    save(req, res, next){
        Product.updateOne({_id : req.params.id}, req.body)
            .then(() => res.redirect('/admin/manage'))
            .catch(next)
    }
    // [DELETE] /admin/:id
    delete(req, res, next){
        Product.deleteOne({_id : req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    rejectOrder(req, res, next){
        UserOrder.updateOne({_id: req.params.id}, {$set: {"status": "Canceled order"}})
                .then((obj) => {
                    res.redirect('/admin/userManagement');
                })
            .catch(next)
    }
    confirmOrder(req, res, next){
        UserOrder.findOne({_id : req.params.id})
        .then(obj => {
            if(obj.status === "Waiting for confirm"){
                UserOrder.updateOne({_id: req.params.id}, {$set: {"status": "Ready to ship"}})
                .then((obj) => {
                    res.redirect('/admin/userManagement');
                })
            }else if(obj.status === "Ready to ship"){
                UserOrder.updateOne({_id: req.params.id}, {$set: {"status": "Delivered to the carrier"}})
                .then((obj) => {
                    res.redirect('/admin/usermanagement');
                })
            }else if(obj.status === "Delivered to the carrier"){
                UserOrder.updateOne({_id: req.params.id}, {$set: {"status": "Completed"}})
                .then((obj) => {
                    res.redirect('/admin/usermanagement');
                })
            }
        })
        .catch((next))
    }
}

module.exports = new AdminController;