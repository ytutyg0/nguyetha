const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");

const SignupController = require("../controllers/signupController");

router.get("/", SignupController.signup);
router.post(
  "/",
  [
    check("email", "Email không hợp lệ").isEmail(),
    check("password", "Mật khẩu phải dài hơn 6 ký tự ")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
  ],
  SignupController.signup_POST
);

module.exports = router;
