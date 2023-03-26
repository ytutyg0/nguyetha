const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");

const UserController = require("../controllers/userController");

router.put(
  "/user-profile/:id",
  [check("phone", "Số điện thoại không hợp lệ").isLength({ min: 8 })],
  UserController.saveProfile
);
router.get("/user-profile", UserController.userProfile);
router.get("/order", UserController.displayorder);
router.post("/order", UserController.order);
router.get("/checkout", UserController.checkout);
router.put("/cancelOrder/:id", UserController.cancelOrder);

module.exports = router;
