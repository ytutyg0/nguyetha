const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const passwordController = require('../controllers/passwordController');

router.get('/:token',passwordController.resetPassword);
router.post('/:token', passwordController.resetPassword_POST);
router.get('/',passwordController.getEmail);
router.post('/', passwordController.sendEmail_POST);

module.exports = router;