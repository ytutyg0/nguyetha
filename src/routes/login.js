const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const LoginController = require('../controllers/loginController');

router.get('/',LoginController.login);
router.post('/',[
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is not valid').not().isEmpty()
], LoginController.login_POST);

module.exports = router;