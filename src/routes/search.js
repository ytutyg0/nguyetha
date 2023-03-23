const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/type/:type', productController.showType);
router.get('/brand/:brand', productController.showBrand);
router.get('/tag/:tag',productController.showTag);
router.get('/allproducts',productController.showAll);
router.get('/', productController.search);

module.exports = router;