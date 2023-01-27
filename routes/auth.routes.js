const express = require("express");
const passportJWT = require("../middlewares/passportJWT")();
const router = express.Router();


const authController = require('../controllers/auth.controller');
const { isEmail, hasPassword, hasName } = require('../validations/validators');

router.post("/login", authController.login);
router.post("/forget", authController.forget);
router.post("/register", [isEmail, hasPassword, hasName], authController.register);
router.get("/me", passportJWT.authenticate(), authController.me);

module.exports = router;