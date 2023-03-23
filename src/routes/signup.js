const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const SignupController = require('../controllers/signupController');

router.get('/', SignupController.signup);
router.post('/',[
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is not valid: password field is required and length is equal or greater than 6').not().isEmpty().isLength({min:6})
  ], SignupController.signup_POST);

module.exports = router;