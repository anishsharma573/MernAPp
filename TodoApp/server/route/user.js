const express = require("express");
const { signUp, login, logout, forgotPassword, passwordReset, getUser } = require("../controllers/userController");
const isLoggedIn = require('../middleware/user');
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/getUser").get(isLoggedIn, getUser);
router.route("/reset/password/:token").post(passwordReset);

module.exports = router;
