const User = require("../models/user");
const { mongooseToObj, mutipleMongooseToObj } = require("../utils/mongoose");
const Cart = require("../models/cart");
const Product = require("../models/productSchema");
const UserOrder = require("../models/userOrder");
const crypto = require("crypto");
const moment = require("moment");
moment.locale("vi");

class UserController {
  //[GET] /user/user-profile
  userProfile(req, res, next) {
    const id = req.user.id;
    User.findById(id)
      .then((user) => {
        user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
        user.save();
        res.render("userProfile", {
          user: mongooseToObj(user),
          token: user.resetPasswordToken,
        });
      })
      .catch(next);
  }
  //[PUT] /user/user-profile
  saveProfile(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        res.redirect("/user/user-profile");
      })
      .catch(next);
  }
  order(req, res, next) {
    const home = req.body.address;
    const city = req.body.city;
    const country = req.body.country;
    const zip = req.body.zip;

    const address = {
      home: home,
      city: city,
      country: country,
      zip: zip,
    };

    const ccname = req.body.ccname;
    const ccnumber = req.body.ccnumber;
    const ccexpiration = req.body.ccexpiration;
    const cccvv = req.body.cccvv;

    const payment = {
      ccname: ccname,
      ccnumber: ccnumber,
      ccexpiration: ccexpiration,
      cccvv: cccvv,
    };
    const d = moment().format("L");
    const cart = new Cart(req.session.cart);
    const userOrder = new UserOrder({
      user: req.user,
      name: req.body.name,
      phone: req.body.phone,
      cart: cart,
      address: address,
      payment: payment,
      dateOrder: d,
      status: "Chờ xác nhận",
    });
    userOrder.save();
    req.session.cart = {};
    console.log(d);
    return res.redirect("/user/order");
  }
  displayorder(req, res, next) {
    UserOrder.find({ user: req.user }, (err, orders) => {
      if (err) {
        res.redirect("/");
      }
      let cart;
      orders = mutipleMongooseToObj(orders);
      orders.forEach((order) => {
        cart = new Cart(order.cart);
        order.item = cart.generateArray();
      });
      res.render("order", { orders });
    });
  }
  checkout(req, res, next) {
    if (!req.session.cart) {
      return res.render("shoppingCart", { products: null });
    }
    const cart = new Cart(req.session.cart);
    const id = req.user.id;
    User.findById(id)
      .then((user) => {
        res.render("checkout", {
          user: mongooseToObj(user),
          products: cart.generateArray(),
          totalPrice: cart.totalPrice.toFixed(2),
          userID: id,
        });
      })
      .catch(next);
  }
  cancelOrder(req, res, next) {
    UserOrder.updateOne(
      { _id: req.params.id },
      { $set: { status: "Canceled order" } }
    )
      .then((obj) => {
        res.redirect("/user/order");
      })
      .catch(next);
  }
}
module.exports = new UserController();
