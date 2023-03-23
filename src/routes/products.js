const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/add-to-cart/remove/:id', productController.removeCart)
router.get('/add-to-cart/:id', productController.addCart);
router.get('/shopping-cart', productController.cartView);
router.get('/:id', productController.index);

module.exports = router;