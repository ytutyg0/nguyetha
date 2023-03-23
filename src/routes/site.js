const express = require('express');
const router = express.Router();

const siteController = require('../controllers/siteController');

router.get('/emailSent', siteController.emailSent);
router.get('/', siteController.home);


module.exports = router;