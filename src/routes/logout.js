const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const LoginController = require('../controllers/loginController');

router.get('/', LoginController.logout);


module.exports = router;