const express = require('express');
const router = express.Router();
const passport = require('passport');

const AuthController = require('../controllers/authController');

router.get('/fb', AuthController.fb);
router.get('/fb/cb', AuthController.fb_cb);

module.exports = router;